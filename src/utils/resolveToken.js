export const resolveToken = () => {
  const authData = localStorage.getItem("247auth");
  if (!authData) return null;
  const parsedData = JSON.parse(authData);
  return parsedData.token;
};
