import axios from "axios";
import { useState } from "react";
import { ENDPOINT_API } from "../../contants";

function Login({ onAuthentication }) {
  const [data, setData] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const username = e.target.username.value;
      const password = e.target.password.value;

      const response = await axios.post(
        `${ENDPOINT_API}/api/v1/users/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        onAuthentication(response.data.success, response.data.data.accessToken);
        setData(response.data);
      }
    } catch (error) {
      setData(error.message);
      console.error("Error logging in:", error);
    }
  };

  return data.success === true ? (
    ""
  ) : (
    <main className="form-signin w-100 m-auto">
      <form method="post" onSubmit={login}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <div className="form-floating">
          <input
            type="text"
            name="username"
            className="form-control"
            id="floatingInput"
            autoComplete="username"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Username / Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            name="password"
            className="form-control"
            id="floatingPassword"
            autoComplete="current-password"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
      </form>
      <p>{data}</p>
    </main>
  );
}

export default Login;
