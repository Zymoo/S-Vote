export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("auth"));
  if (user && user.accessToken) {
    return "Bearer " + user.accessToken;
  } else {
    return {};
  }
}
