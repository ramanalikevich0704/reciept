export const handleSecureError = (error: any, title?: string | null) => {
  const message = error.message || "";
  if (title) {
    alert(title + message);
  } else {
    alert(message);
  }
};
