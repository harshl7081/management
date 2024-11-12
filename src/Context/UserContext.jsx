/* eslint-disable react/prop-types */
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
const DOMAIN_NAME = import.meta.env.VITE_DOMAIN_NAME;

const UserContext = createContext({
  user: null,
});

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  
  if (token !== null) {
    var userToken = jwtDecode(token);
    console.log(userToken);
  } else {
    userToken = null;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetails = await fetch(
        `${DOMAIN_NAME}/api/auth/user/${userToken.id}`,
        {
          method: "GET",
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      const userRes = await userDetails.json();
      console.log(userRes);
      setUser(userRes.data);
    };

    if (userToken !== null) {
      fetchUserData();
    }
  }, []);

  const updateUserContext = async () => {
    const token = localStorage.getItem("token");
    const userToken = jwtDecode(token);

    const userDetails = await fetch(
      `${DOMAIN_NAME}/api/auth/user/${userToken.id}`,
      {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );
    const userRes = await userDetails.json();
    setUser(userRes.data);
  };

  const value = { user, updateUserContext };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  return useContext(UserContext);
};