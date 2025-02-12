import React from "react";

const Header = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>
      <h3 className="navbar-nav mx-auto text-primary text-uppercase">
        Bankingapp
      </h3>
    </nav>
  );
};

export default Header;
