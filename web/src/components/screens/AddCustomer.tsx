import React, { useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

interface CustomerForm {
  accountNo: number;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  amountLimit: number;
  openingBal: number;
  [key: string]: string | number;
}

interface Errors {
  accountNo: number;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  amountLimit: string;
  openingBal: string;
  [key: string]: string | number;
}


interface ApiResponse {
  status: boolean;
  message?: string;
}

const AddCustomer: React.FC = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerForm>({
    accountNo: Date.now(),
    name: "",
    email: "",
    phone: "",
    accountType: "",
    amountLimit: 0,
    openingBal: 0,
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Errors>>({});

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSuccessMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value) {
      setErrors((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      setErrors({ ...errors, [name]: "This field is required" });
    }
    
    if (name === "email" && value !== "") {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        setErrors({ ...errors, [name]: "Invalid email address" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: Partial<Errors> = {};
    
    if (!formData.name.trim()) validationErrors.name = "This field is required";
    if (!formData.phone.trim()) validationErrors.phone = "This field is required";
    if (!formData.email.trim()) {
      validationErrors.email = "This field is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email.trim())) {
      validationErrors.email = "Invalid email address";
    }
    if (!formData.accountType.trim()) validationErrors.accountType = "This field is required";
    if (!formData.amountLimit) validationErrors.amountLimit = "This field is required";
    if (!formData.openingBal) validationErrors.openingBal = "This field is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post<ApiResponse>(
          `${process.env.REACT_APP_API_URL}/customer`,
          {
            ...formData,
            amountLimit: parseFloat(formData.amountLimit.toString()),
            openingBal: parseFloat(formData.openingBal.toString()),
          },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY as string,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.status) {
          setFormData({
            accountNo: Date.now(),
            name: "",
            email: "",
            phone: "",
            accountType: "",
            amountLimit: 0,
            openingBal: 0,
          });
          setErrorMessage("");
          setSuccessMessage(response.data.message || "Customer added successfully");
          setMessage(response.data.message || "Customer added successfully");
          navigate("/customer");
        } else {
          setSuccessMessage("");
          setErrorMessage(response.data.message || "An error occurred");
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Add Customer</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="card card-info">
              <div className="card-header">
                <h3 className="card-title">Fill in the below details</h3>
              </div>
              <div className="row">
                <div className="col-12">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Account Number
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.accountNo
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="accountNo"
                                onChange={handleChange}
                                value={formData.accountNo}
                                autoComplete="off"
                                readOnly
                              />
                              {errors.accountNo && (
                                <div className="invalid-feedback text-left">
                                  {errors.accountNo}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Account Type
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <select
                                className={
                                  errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="accountType"
                                onChange={handleChange}
                              >
                                <option value="">Select</option>
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                              </select>
                              {errors.accountType && (
                                <div className="invalid-feedback text-left">
                                  {errors.accountType}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Name
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="name"
                                onChange={handleChange}
                                value={formData.name}
                                autoComplete="off"
                              />
                              {errors.name && (
                                <div className="invalid-feedback text-left">
                                  {errors.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Email Address
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.email
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                autoComplete="off"
                              />
                              {errors.email && (
                                <div className="invalid-feedback text-left">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Phone
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.phone
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="phone"
                                onChange={handleChange}
                                value={formData.phone}
                                autoComplete="off"
                              />
                              {errors.phone && (
                                <div className="invalid-feedback text-left">
                                  {errors.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Spend Limit($)
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="number"
                                className={
                                  errors.amountLimit
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="amountLimit"
                                onChange={handleChange}
                                value={formData.amountLimit}
                                autoComplete="off"
                              />
                              {errors.amountLimit && (
                                <div className="invalid-feedback text-left">
                                  {errors.amountLimit}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Opening Balance($)
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="number"
                                className={
                                  errors.openingBal
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="openingBal"
                                onChange={handleChange}
                                value={formData.openingBal}
                                autoComplete="off"
                              />
                              {errors.openingBal && (
                                <div className="invalid-feedback text-left">
                                  {errors.openingBal}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button type="submit" className="btn btn-info">
                        Submit
                      </button>
                    </div>
                  </form>
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

export default AddCustomer;
