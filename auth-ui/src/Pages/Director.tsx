import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AllInOne from "./AllInOne";
import Login from "./Login";
import Test from "./Test";

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();
  useEffect(() => {
    console.log("protected route");
  }, []);
  if (!auth.user && !auth.userLoading) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function Director() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          {/* <Route path="/" element={<AllInOne />} /> */}
          {/* <ProtectedRoute path="/" element={<AllInOne />}></ProtectedRoute> */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <AllInOne />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/test"
            element={
              <RequireAuth>
                <Test />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
