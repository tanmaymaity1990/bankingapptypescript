import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  amountLimit: number;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  amountLimit?: string;
  [key: string]: string | undefined;
}

const EditCustomer: React.FC = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    amountLimit: 0,
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const token = localStorage.getItem("token");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((current) => {
      const { [name]: _, ...rest } = current;
      return value ? rest : { ...rest, [name]: "This field is required" };
    });
    if (name === "email" && value !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: "Invalid email address" }));
    }
  };

  const getCustomer = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer/${id}`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY!,
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setErrorMessage("");
        setFormData(response.data.result);
      } else {
        setSuccessMessage("");
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors: Errors = {};
    if (!formData.name.trim()) validationErrors.name = "This field is required";
    if (!formData.phone.trim()) validationErrors.phone = "This field is required";
    if (!formData.email.trim()) {
      validationErrors.email = "This field is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email.trim())) {
      validationErrors.email = "Invalid email address";
    }
    if (!formData.amountLimit) validationErrors.amountLimit = "This field is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/customer/${id}`,
          { ...formData, amountLimit: parseFloat(String(formData.amountLimit)) },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY!,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setMessage(response.data.message);
          navigate("/customer");
        } else {
          setSuccessMessage("");
          setErrorMessage(response.data.message);
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
      }
    }
  };

  useEffect(() => {
    getCustomer();
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
                <h1>Edit Customer</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Fill in the below details</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>
                  <div className="form-group">
                    <label>Spend Limit ($)</label>
                    <input type="number" className="form-control" name="amountLimit" value={formData.amountLimit} onChange={handleChange} />
                    {errors.amountLimit && <small className="text-danger">{errors.amountLimit}</small>}
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default EditCustomer;
