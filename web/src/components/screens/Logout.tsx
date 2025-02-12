import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

const Logout = () => {
  const navigate = useNavigate();
  const { setMessage } = useMessage();

  useEffect(() => {
    localStorage.removeItem("token");
    setMessage("Successfully Logout!");
    navigate("/");
  }, []);

  return <div></div>;
};

export default Logout;
