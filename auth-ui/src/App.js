import { useState } from "react";
import { gql, request } from "graphql-request";

const createUser = gql`
  mutation createUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      username
    }
  }
`;
const login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="App">
      <div className="login">
        <h1>Testing</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button
          onClick={async () => {
            setLoading(true);
            const resp = await request("/graphql", login, {
              username,
              password,
            });
            setToken(resp.login.token);
            setLoading(false);
          }}
        >
          Login
        </button>
      </div>
      <div className="create user">
        <h1>Create User</h1>
        <input
          value={createUsername}
          onChange={(e) => setCreateUsername(e.target.value)}
        />
        <input
          value={createPassword}
          onChange={(e) => setCreatePassword(e.target.value)}
        />
        <input
          value={createEmail}
          onChange={(e) => setCreateEmail(e.target.value)}
        />
        <button
          onClick={async () => {
            setLoading(true);
            const resp = await request("/graphql", createUser, {
              username: createUsername,
              email: createEmail,
              password: createPassword,
            });
            console.log(resp);
            setLoading(false);
          }}
        >
          Create User
        </button>
      </div>
      {token}
    </div>
  );
}

export default App;
