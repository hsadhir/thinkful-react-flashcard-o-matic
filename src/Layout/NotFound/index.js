import React from "react";
import { Link } from "react-router-dom/";

import "./NotFound.css";

function NotFound() {
  return (
    <div className="NotFound">
      <h2>
        Requested Page <span>Not Found</span>
      </h2>
      <p>
        <Link className="return-home" to="/">
          Return Home
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
