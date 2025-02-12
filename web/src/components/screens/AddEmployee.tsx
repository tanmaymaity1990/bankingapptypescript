import React, { useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

interface EmployeeForm {
  empID: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confPass: string;
}

interface ValidationErrors {
  empID?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confPass?: string;
  [key: string]: string | undefined;
}

const AddEmployee: React.FC = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EmployeeForm>({
    empID: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confPass: "",
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setErrors((current) => {
      const updatedErrors = { ...current };
      if (value) {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = "This field is required";
      }
      
      if (name === "email" && value !== "") {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          updatedErrors[name] = "Invalid email address";
        }
      }
      if (name === "confPass" && value !== "") {
        if (value !== formData.password) {
          updatedErrors[name] = "Password and Confirm Password do not match";
        }
      }
      return updatedErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: ValidationErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        validationErrors[key] = "This field is required";
      }
    });

    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }

    if (formData.password !== formData.confPass) {
      validationErrors.confPass = "Password and Confirm Password do not match";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee`,
          {
            empID: formData.empID,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY as string,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.status) {
          setFormData({ empID: "", name: "", email: "", phone: "", password: "", confPass: "" });
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setMessage(response.data.message);
          navigate("/employee");
        } else {
          setSuccessMessage("");
          setErrorMessage(response.data.message);
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
                <h1>Add Employee</h1>
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
                              Employee ID
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.empID
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="empID"
                                onChange={handleChange}
                                value={formData.empID}
                                autoComplete="off"
                              />
                              {errors.empID && (
                                <div className="invalid-feedback text-left">
                                  {errors.empID}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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
                      </div>
                      <div className="row">
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
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Password
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="password"
                                className={
                                  errors.password
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="password"
                                onChange={handleChange}
                                value={formData.password}
                                autoComplete="off"
                              />
                              {errors.password && (
                                <div className="invalid-feedback text-left">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Confirm Password
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="password"
                                className={
                                  errors.confPass
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="confPass"
                                onChange={handleChange}
                                value={formData.confPass}
                                autoComplete="off"
                              />
                              {errors.confPass && (
                                <div className="invalid-feedback text-left">
                                  {errors.confPass}
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

export default AddEmployee;