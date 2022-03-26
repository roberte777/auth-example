// Hook (use-auth.js)
import request, { gql } from "graphql-request";
import React, { useState, useEffect, useContext, createContext } from "react";
const createUser = gql`
  mutation createUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      username
    }
  }
`;
const loginQuery = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

const AuthContext = createContext({ user: null });
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (username: string, password: string) => {
    return request("/graphql", loginQuery, { username, password }).then(
      (res) => {
        setUser(res.login.user);
        return res.login.user;
      }
    );
  };
  const signup = (username: string, email: string, password: string) => {
    return request("/graphql", createUser, { username, password, email }).then(
      (res) => {
        setUser(res.createUser.user);
        return res.createUser.user;
      }
    );
  };
  const signout = () => {
    // return firebase
    //   .auth()
    //   .signOut()
    //   .then(() => {
    //     setUser(false);
    //   });
    setUser(null);
  };
  // const sendPasswordResetEmail = (email) => {
  //   return firebase
  //     .auth()
  //     .sendPasswordResetEmail(email)
  //     .then(() => {
  //       return true;
  //     });
  // };
  // const confirmPasswordReset = (code, password) => {
  //   return firebase
  //     .auth()
  //     .confirmPasswordReset(code, password)
  //     .then(() => {
  //       return true;
  //     });
  // };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    async function findUser() {
      console.log("ran finduser");
      const user = await request(
        "/graphql",
        gql`
          {
            user {
              username
            }
          }
        `
      ).catch((e) => setUser(null));
      setUser(user.user.username);
    }
    findUser();
  }, []);
  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    // sendPasswordResetEmail,
    // confirmPasswordReset,
  };
}
