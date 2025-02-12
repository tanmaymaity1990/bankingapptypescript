import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useMessage();

  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((currentErrors) => {
      const newErrors = { ...currentErrors };
      if (value) {
        delete newErrors[name as keyof Errors];
      } else {
        newErrors[name as keyof Errors] = "This field is required";
      }

      if (name === "email" && value !== "") {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email address";
        }
      }

      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: Errors = {};
    if (!formData.email.trim()) {
      validationErrors.email = "This field is required";
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailRegex.test(formData.email.trim())) {
        validationErrors.email = "Invalid email address";
      }
    }

    if (!formData.password.trim()) {
      validationErrors.password = "This field is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY as string,
            },
          }
        );

        if (response.data.status) {
          localStorage.setItem("token", response.data.token);
          setFormData({ email: "", password: "" });
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          navigate("/dashboard");
        } else {
          setSuccessMessage("");
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <h3 className="h1">
              <b>BankingApp</b>
            </h3>
          </div>
          <div className="card-body">
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
            {message && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
              </div>
            )}
            <p className="login-box-msg">Sign in to start your session</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  autoComplete="off"
                  placeholder="Email"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
                {errors.email && <div className="invalid-feedback text-left">{errors.email}</div>}
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  autoComplete="off"
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                {errors.password && <div className="invalid-feedback text-left">{errors.password}</div>}
              </div>
              <div className="row">
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
