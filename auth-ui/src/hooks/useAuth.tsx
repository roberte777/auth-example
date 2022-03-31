// Hook (use-auth.js)
import request, { gql } from "graphql-request";
import React, { useState, useEffect, useContext, createContext } from "react";
import { useLocation } from "react-router-dom";
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

const AuthContext = createContext({
  user: null as any,
  login: async (username: string, password: string) => {},
  signup: async (username: string, email: string, password: string) => {},
  signout: () => {},
  userLoading: true,
});
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
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = async (username: string, password: string) => {
    return await request("/graphql", loginQuery, { username, password }).then(
      (res) => {
        setUser(res.login.user);
        return res.login.user;
      }
    );
  };
  const signup = async (username: string, email: string, password: string) => {
    return await request("/graphql", createUser, {
      username,
      password,
      email,
    }).then((res) => {
      setUser(res.createUser.user);
      return res.createUser.user;
    });
  };

  const signout = async () => {
    // return firebase
    //   .auth()
    //   .signOut()
    //   .then(() => {
    //     setUser(false);
    //   });
    setUser(null);
    await request(
      "/graphql",
      gql`
        mutation Mutation {
          logout
        }
      `
    );
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

  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    async function findUser() {
      setUserLoading(true);
      try {
        const user = await request(
          "/graphql",
          gql`
            {
              user {
                username
              }
            }
          `
        );
        setUser(user?.user);
        setUserLoading(false);
      } catch (e) {
        console.error(e);
        setUser(null);
        setUserLoading(false);
      }
    }
    findUser();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    login,
    signup,
    signout,
    userLoading,
    // sendPasswordResetEmail,
    // confirmPasswordReset,
  };
}
