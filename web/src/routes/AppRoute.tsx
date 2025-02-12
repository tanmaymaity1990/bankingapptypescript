import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/screens/Login";
import Dashboard from "../components/screens/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Employee from "../components/screens/Employee";
import AddEmployee from "../components/screens/AddEmployee";
import { MessageProvider } from "../context/MessageProvider";
import Logout from "../components/screens/Logout";
import Customer from "../components/screens/Customer";
import AddCustomer from "../components/screens/AddCustomer";
import EditCustomer from "../components/screens/EditCustomer";
import ViewCustomer from "../components/screens/ViewCustomer";
import Transaction from "../components/screens/Transaction";
import AddTransaction from "../components/screens/AddTransaction";

const AppRoute: React.FC = () => {
  return (
    <MessageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <Employee />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/add"
            element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <PrivateRoute>
                <Customer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/add"
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/edit/:id"
            element={
              <PrivateRoute>
                <EditCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/view/:id"
            element={
              <PrivateRoute>
                <ViewCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <PrivateRoute>
                <Transaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction/add"
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </MessageProvider>
  );
};

export default AppRoute;
