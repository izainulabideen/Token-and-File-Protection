import React, { useState } from "react";
import Login from "./components/Login/Login";
import Download from "./components/Download/Download";
import Upload from "./components/Upload/Upload";
import Logout from "./components/Logout/Logout";

function App() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(null);

  const handleAuthentication = (status, token) => {
    setAuth(status);
    setToken(token);
  };

  return (
    <>
      {!auth ? (
        <Login onAuthentication={handleAuthentication} />
      ) : (
        <>
          <Logout onAuthentication={handleAuthentication} token={token} />
          <Upload token={token} />
          <Download token={token} />
        </>
      )}
    </>
  );
}

export default App;
