import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

interface Customer {
  id: number;
  accountNo: string;
  name: string;
  email: string;
  phone: string;
  created: string;
}

const Customer: React.FC = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useMessage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  const getCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customers`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setErrorMessage("");
        setCustomers(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    setSearch(e.target.value);
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    setSearch("");
    getCustomers();
    navigate("/customer");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer/search/${search}`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setErrorMessage("");
        setCustomers(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getCustomers();
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
                <h1>Customers</h1>
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
                <Link to="/customer/add" className="btn btn-success mb-2">
                  Add Customer
                </Link>
                <form className="mb-3" onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      name="search"
                      value={search}
                      onChange={handleChange}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        Go!
                      </button>
                      <button className="btn btn-info" onClick={handleReset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">List of customers</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Account Number</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Created</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.length > 0 ? (
                          customers.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.accountNo}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone}</td>
                              <td>{item.created}</td>
                              <td>
                                <Link to={`/customer/view/${item.id}`}>
                                  <i className="fa fa-eye mr-3"></i>
                                </Link>
                                <Link to={`/customer/edit/${item.id}`}>
                                  <i className="fa fa-edit"></i>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-danger text-center">
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

export default Customer;
