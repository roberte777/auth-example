import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  return (
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
          await login(username, password);
          setLoading(false);
        }}
      >
        Login
      </button>
    </div>
  );
}
