// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login: async ({ email, password }) => {
    const request = new Request("http://localhost:3001/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      const auth = await response.json();
      localStorage.setItem("auth", JSON.stringify(auth));
    } catch (e) {
      throw new Error("Network error");
    }
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      //return Promise.reject({ redirectTo: '/sing-in' });
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth")
      ? Promise.resolve()
      : Promise.reject({ message: "Login Required" }),
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { id, email, accessToken } = JSON.parse(
        localStorage.getItem("auth")
      );
      return Promise.resolve({ id, email, accessToken });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    const data = localStorage.getItem("auth");
    if (data) {
      const { roles } = JSON.parse(data);
      return roles ? Promise.resolve(roles) : Promise.reject();
    }
    return Promise.reject();
  },
};
