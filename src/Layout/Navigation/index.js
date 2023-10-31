import React from "react";
import { Link } from "react-router-dom";

import "./Navigation.css";

export default function Navigation({ prevPages, currentPage }) {
  return (
    <nav className="navbar">
      <p>
        {prevPages && prevPages.map((page, index) => (
          <span key={index}>
            <Link to={page.link}>
              {page.name}
            </Link>
            &emsp;/&emsp;
          </span>
        ))}
        {currentPage}
      </p>
    </nav>
  );
}
