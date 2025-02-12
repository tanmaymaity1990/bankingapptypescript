import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <NavLink to="/dashboard" className="brand-link">
        <img
          src="/assets/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">Employee Panel</span>
      </NavLink>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customer" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>Customers</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/transaction" className="nav-link">
                <i className="nav-icon fas fa-credit-card"></i>
                <p>Transaction</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/employee" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>Employees</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/logout" className="nav-link">
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Logout</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
