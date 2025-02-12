import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";

interface Transaction {
  fromAccount: string;
  toAccount: string;
  amount: number;
  created: string;
  message: string;
}

interface Customer {
  name: string;
  accountNo: string;
  overdueAmount: number;
  message: string;
}

interface ApiResponse<T> {
  status: boolean;
  result: T;
  message?: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const token = localStorage.getItem("token");

  const getTransaction = async () => {
    try {
      const response = await axios.get<ApiResponse<Transaction[]>>(
        `${process.env.REACT_APP_API_URL}/transaction/limit/10`,
        {
          headers: {
            apikey: process.env.REACT_APP_API_KEY as string,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setErrorMessage("");
        setTransactions(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const getOverdueCustomer = async () => {
    try {
      const response = await axios.get<ApiResponse<Customer[]>>(
        `${process.env.REACT_APP_API_URL}/transaction/overdue`,
        {
          headers: {
            apikey: process.env.REACT_APP_API_KEY as string,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setErrorMessage("");
        setCustomers(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getTransaction();
    getOverdueCustomer();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {errorMessage && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
                {customers.map((customer, index) => (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert" key={index}>
                    Customer {customer.name} with account number {customer.accountNo} has an overdue payment of $
                    {customer.overdueAmount}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                  </div>
                ))}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Latest Transactions</h3>
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

export default Dashboard;
