const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

exports.manage = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/employee.json");
  let employees = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    employees = JSON.parse(data);
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: employees,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};

exports.insert = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/employee.json");
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  let employeeData = {
    id: uuidv4(),
    name: req.body.name,
    empID: req.body.empID,
    email: req.body.email,
    phone: req.body.phone,
    password: hashPassword,
    created: moment().format("D-MM-YYYY"),
  };
  let employees = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    employees = JSON.parse(data);
  }
  if (employees.some((employee) => employee.email === employeeData.email)) {
    res.status(409).json({
      status: false,
      message: "Email already exist.",
    });
    return;
  }
  if (employees.some((employee) => employee.phone === employeeData.phone)) {
    res.status(409).json({
      status: false,
      message: "Phone already exist.",
    });
    return;
  }

  employees.push(employeeData);
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2), "utf8");
  res.status(201).json({
    status: true,
    message: "Record added successfully.",
  });
};
