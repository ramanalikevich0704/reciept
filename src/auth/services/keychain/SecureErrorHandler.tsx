export const handleSecureError = (error: any) => {
  const message = error.message || "";
  alert(message);
};
