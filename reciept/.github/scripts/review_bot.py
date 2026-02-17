import os
import json
import re
import sys
import google.generativeai as genai
from github import Github, Auth

# --- Configuration ---
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO = os.getenv('REPO_NAME')
PR_NUM_STR = os.getenv('PR_NUMBER')

# Collect all available keys into a list
API_KEYS = [
    os.getenv('GEMINI_API_KEY'),
    os.getenv('GEMINI_API_KEY2'),
    os.getenv('GEMINI_API_KEY3'),
]
# Leave only those that are not empty
valid_api_keys = [k for k in API_KEYS if k]

if not valid_api_keys:
    print("❌ Error: No GEMINI_API_KEYS found!")
    sys.exit(1)

if not GITHUB_TOKEN or not REPO or not PR_NUM_STR:
    print("❌ Error: Missing GITHUB_TOKEN, REPO_NAME or PR_NUMBER!")
    sys.exit(1)

PR_NUM = int(PR_NUM_STR)

# --- Helper: Strict Diff Parsing ---
def get_changed_lines_only(patch):
    """
    Returns only line numbers that were ADDED (+) in this PR.
    """
    valid_lines = set()
    if not patch:
        return valid_lines

    current_new_line = 0

    for line in patch.split('\n'):
        # Parsing the chunk header @@ -old,count +new,count @@
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

# --- GitHub Connection ---
auth = Auth.Token(GITHUB_TOKEN)
g = Github(auth=auth)
repo = g.get_repo(REPO)
pr = repo.get_pull(PR_NUM)
last_commit = list(pr.get_commits())[-1]

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

# Truncate to safe limit (approx 8-10k tokens)
if len(diff_text) > 35000:
    diff_text = diff_text[:35000] + "\n...(truncated)..."

# --- PROMPT ENGINEERING ---
prompt = f"""
You are a cynical, hard-to-please Senior Code Reviewer.
Your goal is to make the code cleaner, safer, and more maintainable.

INSTRUCTIONS:
1. **Focus strictly on:**
   - Logic bugs and potential runtime errors.
   - Security vulnerabilities.
   - Performance bottlenecks.
   - Code cleanliness (naming, duplication, complexity).
   - Maintainability.

2. **STRICTLY PROHIBITED:**
   - NO compliments ("Great job", "Nice code").
   - NO comments on minor formatting (indentation, spaces).
   - NO stating the obvious.

3. **Output Format:**
   - Provide a valid JSON array.
   - `line` MUST be a line number from the provided diff that starts with `+`.
   - `body` must be concise, direct, and constructive.

JSON Structure:
[
  {{
    "path": "filename",
    "line": integer_line_number,
    "body": "Critical feedback here."
  }}
]

Review these changes:
{diff_text}
"""

# --- AI Request with Failover ---
raw_content = None
used_model = "gemini-2.5-flash"

for i, key in enumerate(valid_api_keys):
    try:
        print(f"🤖 Connecting to Gemini with Key #{i+1}...")
        genai.configure(api_key=key)
        model = genai.GenerativeModel(used_model)

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        raw_content = response.text
        print("✅ Analysis complete.")
        break
    except Exception as e:
        print(f"⚠️ Key #{i+1} failed: {e}")
        if i == len(valid_api_keys) - 1:
            print("💀 All API keys failed. Exiting.")
            sys.exit(1)

# --- Parsing & Posting ---
comments_to_send = []

try:
    if not raw_content:
        raise ValueError("Empty response from AI")

    # This protects against AI writing intro text like "Here is the review:"
    json_match = re.search(r'\[.*\]', raw_content, re.DOTALL)

    if json_match:
        clean_json = json_match.group(0)
        ai_comments = json.loads(clean_json)
    else:
        # Fallback if regex fails
        clean_json = raw_content.replace("```json", "").replace("```", "").strip()
        ai_comments = json.loads(clean_json)

    for comment in ai_comments:
        path = comment.get('path')
        line = int(comment.get('line', 0))
        body = comment.get('body')

        if path not in file_valid_lines:
            continue

        # HARD CHECK: Comment ONLY lines with a plus (+)
        if line not in file_valid_lines[path]:
            print(f"⚠️ Skipping comment on line {line} in {path} (not a changed line).")
            continue

        comments_to_send.append({
            'path': path,
            'line': line,
            'body': body
        })

except json.JSONDecodeError as e:
    print(f"❌ JSON Parsing Error: {e}")
    print(f"Raw Output: {raw_content}")
    sys.exit(0)
except Exception as e:
    print(f"❌ Error: {e}")
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
else:
    print("👍 No critical issues found.")