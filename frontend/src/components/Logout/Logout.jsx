import React from "react";
import axios from "axios";
import { ENDPOINT_API } from "../../contants";

function Logout({ onAuthentication, token }) {
  const logout = async () => {
    try {
      await axios.post(`${ENDPOINT_API}/api/v1/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onAuthentication(false, null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button onClick={logout} className="btn btn-danger">
      Logout
    </button>
  );
}

export default Logout;
