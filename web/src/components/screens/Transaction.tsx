import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

interface TransactionData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  created: string;
}

const Transaction: React.FC = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useMessage();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  const getTransactions = async () => {
    try {
      const response = await axios.get<{ status: boolean; result: TransactionData[]; message?: string }>(
        `${process.env.REACT_APP_API_URL}/transactions`,
        {
          headers: {
            apikey: process.env.REACT_APP_API_KEY!,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setErrorMessage("");
        setTransactions(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message || "Error fetching transactions");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getTransactions();
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
                <h1>Transactions</h1>
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
                <Link to="/transaction/add" className="btn btn-success mb-2">
                  Add Transaction
                </Link>
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
                              <td>${item.amount.toFixed(2)}</td>
                              <td>{new Date(item.created).toLocaleDateString()}</td>
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

export default Transaction;
