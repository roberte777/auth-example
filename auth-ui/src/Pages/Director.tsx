import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AllInOne from "./AllInOne";

export default function Director() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<AllInOne />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
