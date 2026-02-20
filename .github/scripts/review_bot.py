import os
import json
import re
import sys
from google import genai
from google.genai import types
from github import Github, Auth

# --- Configuration ---
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO = os.getenv('REPO_NAME')
PR_NUM_STR = os.getenv('PR_NUMBER')

API_KEYS = [
    os.getenv('GEMINI_API_KEY'),
    os.getenv('GEMINI_API_KEY2'),
    os.getenv('GEMINI_API_KEY3'),
]
valid_api_keys = [k for k in API_KEYS if k]

if not valid_api_keys:
    print("❌ Error: No GEMINI_API_KEYS found!")
    sys.exit(1)

if not GITHUB_TOKEN or not REPO or not PR_NUM_STR:
    print("❌ Error: Missing GITHUB_TOKEN, REPO_NAME or PR_NUMBER!")
    sys.exit(1)

PR_NUM = int(PR_NUM_STR)

# --- GitHub Connection ---
auth = Auth.Token(GITHUB_TOKEN)
g = Github(auth=auth)
repo = g.get_repo(REPO)
pr = repo.get_pull(PR_NUM)
last_commit = list(pr.get_commits())[-1]

# --- Error Handling Helper ---
def post_error_comment(error_message):
    """Posts a comment to the PR if the bot encounters a critical failure"""
    fallback_text = (
        f"### 🤖 Oops, AI Code Review is temporarily unavailable\n"
        f"I tried to review this PR, but something went wrong. "
        f"The AI might have returned a broken response, or API limits were exceeded.\n\n"
        f"**Error Details:** `{error_message}`\n\n"
        f"_Check the GitHub Actions logs for more details._"
    )
    try:
        pr.create_issue_comment(fallback_text)
        print("✅ Fallback error comment posted to PR.")
    except Exception as e:
        print(f"❌ Failed to post error comment: {e}")

# --- Helper: Strict Diff Parsing ---
def get_changed_lines_only(patch):
    """Returns only line numbers that were ADDED (+) in this PR."""
    valid_lines = set()
    if not patch:
        return valid_lines

    current_new_line = 0
    for line in patch.split('\n'):
        match = re.match(r'^@@ \-\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@', line)
        if match:
            current_new_line = int(match.group(1))
            continue

        if line.startswith('+') and not line.startswith('+++'):
            valid_lines.add(current_new_line)
            current_new_line += 1
        elif line.startswith(' '):
            current_new_line += 1
        elif line.startswith('-'):
            pass

    return valid_lines

# --- Fetching Diff ---
print(f"Fetching diff for PR #{PR_NUM}...")
diff_text = ""
file_valid_lines = {}

files = list(pr.get_files())
for file in files:
    # Skip deleted/renamed/empty files
    if file.status in ["removed", "deleted", "renamed"] or not file.patch:
        continue

    valid_set = get_changed_lines_only(file.patch)
    if not valid_set:
        continue

    file_valid_lines[file.filename] = valid_set
    diff_text += f"\n--- FILE: {file.filename} ---\n{file.patch}\n"

if not diff_text.strip():
    print("No commentable changes found.")
    sys.exit(0)

# Truncate to safe limit
if len(diff_text) > 35000:
    diff_text = diff_text[:35000] + "\n...(truncated)..."

# --- PROMPT ENGINEERING ---
# Simplified prompt: no longer need to beg the AI to output valid JSON
prompt = f"""
You are a cynical, hard-to-please Senior Code Reviewer.
Your goal is to make the code cleaner, safer, and more maintainable.

INSTRUCTIONS:
1. **Focus strictly on:** Logic bugs, security, performance, and cleanliness.
2. **STRICTLY PROHIBITED:** NO compliments. NO minor formatting comments.
3. `line` MUST be a line number from the provided diff that starts with `+`.

Review these changes:
{diff_text}
"""

# --- STRICT JSON SCHEMA FOR AI ---
review_schema = types.Schema(
    type=types.Type.ARRAY,
    items=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "path": types.Schema(type=types.Type.STRING),
            "line": types.Schema(type=types.Type.INTEGER),
            "body": types.Schema(type=types.Type.STRING),
        },
        required=["path", "line", "body"]
    )
)

# --- AI Request ---
raw_content = None
used_model = "gemini-2.5-flash"

for i, key in enumerate(valid_api_keys):
    try:
        print(f"🤖 Connecting to Gemini with Key #{i+1}...")
        client = genai.Client(api_key=key)

        response = client.models.generate_content(
            model=used_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=review_schema, # Enable forced schema
                temperature=0.1, # Lower temperature to reduce AI "hallucinations"
            ),
        )
        raw_content = response.text
        print("✅ Analysis complete.")
        break
    except Exception as e:
        print(f"⚠️ Key #{i+1} failed: {e}")
        if i == len(valid_api_keys) - 1:
            error_msg = "All API keys have exhausted their limits or are unavailable."
            print(f"💀 {error_msg}")
            post_error_comment(error_msg)
            sys.exit(1)

# --- Parsing & Posting ---
comments_to_send = []

try:
    if not raw_content:
        raise ValueError("AI returned an empty response.")

    # No more sanitizers or regex! The schema guarantees valid JSON.
    ai_comments = json.loads(raw_content)

    for comment in ai_comments:
        path = comment.get('path')
        line = int(comment.get('line', 0))
        body = comment.get('body')

        if path not in file_valid_lines or line not in file_valid_lines[path]:
            continue

        comments_to_send.append({
            'path': path,
            'line': line,
            'body': body
        })

except json.JSONDecodeError as e:
    print(f"❌ JSON Parsing Error: {e}")
    post_error_comment(f"Failed to parse JSON from AI: {e}\nRaw Output: {raw_content}")
    sys.exit(0)
except Exception as e:
    print(f"❌ Error: {e}")
    post_error_comment(f"Critical script error: {str(e)}")
    sys.exit(1)

# --- Batch Posting ---
if comments_to_send:
    MAX_COMMENTS = 15
    if len(comments_to_send) > MAX_COMMENTS:
        print(f"Info: Truncating {len(comments_to_send)} comments to top {MAX_COMMENTS}.")
        comments_to_send = comments_to_send[:MAX_COMMENTS]

    print(f"🚀 Posting {len(comments_to_send)} comments as a Single Review...")
    try:
        pr.create_review(
            commit=last_commit,
            body="### 🤖 AI Code Review\n",
            event="COMMENT",
            comments=comments_to_send
        )
        print("✅ Review posted successfully.")
    except Exception as e:
        print(f"❌ GitHub API Error: {e}")
        post_error_comment(f"Failed to publish review via GitHub API: {str(e)}")
else:
    print("👍 No critical issues found.")
    # Added a success message directly to PR
    try:
        success_text = (
            "### 🤖 AI Code Review\n"
            "Everything looks good! No critical issues found. 👍"
        )
        pr.create_issue_comment(success_text)
        print("✅ Success comment posted to PR.")
    except Exception as e:
        print(f"❌ Failed to post success comment: {e}")