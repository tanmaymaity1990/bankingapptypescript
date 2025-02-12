import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

interface Customer {
  accountNo: string;
  accountType: string;
  name: string;
  email: string;
  phone: string;
  amountLimit: number;
  openingBal: number;
  created: string;
}

interface Transaction {
  fromAccount: string;
  toAccount: string;
  amount: number;
  created: string;
}

const ViewCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { message, setMessage } = useMessage();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  const getCustomer = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer/${id}`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setErrorMessage("");
        setCustomer(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer/transaction/${id}`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setErrorMessage("");
        setTransactions(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getCustomer();
    getTransactions();
  }, [customer, transactions]);

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
                <h1>View Customer</h1>
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
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Customer Details</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <tbody>
                        <tr>
                          <td>Account Number</td>
                          <td>{customer?.accountNo}</td>
                        </tr>
                        <tr>
                          <td>Account Type</td>
                          <td>{customer?.accountType}</td>
                        </tr>
                        <tr>
                          <td>Name</td>
                          <td>{customer?.name}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td>{customer?.email}</td>
                        </tr>
                        <tr>
                          <td>Phone</td>
                          <td>{customer?.phone}</td>
                        </tr>
                        <tr>
                          <td>Spend Limit</td>
                          <td>{customer?.amountLimit}</td>
                        </tr>
                        <tr>
                          <td>Opening Balanace</td>
                          <td>{customer?.openingBal}</td>
                        </tr>
                        <tr>
                          <td>Created</td>
                          <td>{customer?.created}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">List of transactions</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>From Account</th>
                          <th>To Account</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length > 0 ? (
                          transactions.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.fromAccount}</td>
                              <td>{item.toAccount}</td>
                              <td>${item.amount}</td>
                              <td>{item.created}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-danger text-center">
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

export default ViewCustomer;
