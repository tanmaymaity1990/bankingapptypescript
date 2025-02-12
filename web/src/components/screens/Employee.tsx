import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

interface Employee {
  empID: string;
  name: string;
  email: string;
  phone: string;
  created: string;
}

const Employee: React.FC = () => {
  const { message, setMessage } = useMessage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  const getEmployee = async () => {
    try {
      const response = await axios.get<{ status: boolean; result: Employee[]; message?: string }>(
        `${process.env.REACT_APP_API_URL}/employees`,
        {
          headers: {
            apikey: process.env.REACT_APP_API_KEY!,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setErrorMessage("");
        setEmployees(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message || "Failed to fetch employees.");
      }
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Employees</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {message && <div className="alert alert-success">{message}</div>}
              </div>
              <div className="col-12">
                <Link to="/employee/add" className="btn btn-success mb-2">
                  Add Employee
                </Link>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">List of employees</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Emp ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.length > 0 ? (
                          employees.map((item, index) => (
                            <tr key={item.empID}>
                              <td>{index + 1}</td>
                              <td>{item.empID}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone}</td>
                              <td>{item.created}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-danger text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Employee;
