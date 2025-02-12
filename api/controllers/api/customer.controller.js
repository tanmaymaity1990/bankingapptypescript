const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

exports.manage = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/customer.json");
  let customers = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    customers = JSON.parse(data);
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: customers,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};

exports.insert = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/customer.json");
  let customerData = {
    id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    accountNo: req.body.accountNo,
    accountType: req.body.accountType,
    amountLimit: req.body.amountLimit,
    openingBal: req.body.openingBal,
    created: moment().format("D-MM-YYYY"),
  };
  let customers = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    customers = JSON.parse(data);
  }
  if (customers.some((customer) => customer.email === customerData.email)) {
    res.status(409).json({
      status: false,
      message: "Email already exist.",
    });
    return;
  }
  if (customers.some((customer) => customer.phone === customerData.phone)) {
    res.status(409).json({
      status: false,
      message: "Phone already exist.",
    });
    return;
  }

  customers.push(customerData);
  fs.writeFileSync(filePath, JSON.stringify(customers, null, 2), "utf8");
  res.status(201).json({
    status: true,
    message: "Record added successfully.",
  });
};

exports.update = (req, res, next) => {
  let id = req.params.id;
  const filePath = path.join(__dirname, "../../data/customer.json");
  let customerData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    amountLimit: req.body.amountLimit,
  };

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(404).json({
        status: false,
        message: "Error reading file.",
      });
      return;
    }

    try {
      const customers = JSON.parse(data);
      const recordIndex = customers.findIndex((record) => record.id === id);
      if (recordIndex === -1) {
        res.status(404).json({
          status: false,
          message: "Record not found.",
        });
        return;
      }

      customers[recordIndex] = { ...customers[recordIndex], ...customerData };

      fs.writeFile(
        filePath,
        JSON.stringify(customers, null, 2),
        "utf8",
        (err) => {
          if (err) {
            res.status(400).json({
              status: false,
              message: "Error writing file.",
            });
            return;
          }
          res.status(200).json({
            status: true,
            message: "Record updated successfully.",
          });
        }
      );
    } catch (parseErr) {
      res.status(201).json({
        status: true,
        message: "Error parsing JSON.",
      });
    }
  });
};
exports.view = (req, res, next) => {
  let id = req.params.id;
  const filePath = path.join(__dirname, "../../data/customer.json");
  let customers = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    customers = JSON.parse(data);
    const record = customers.find((record) => record.id === id);
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: record,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};
exports.search = (req, res, next) => {
  let keyword = req.params.keyword;
  const filePath = path.join(__dirname, "../../data/customer.json");
  let customers = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    customers = JSON.parse(data);
    const filteredRecords = customers.filter((record) =>
      Object.values(record).some((value) => String(value).includes(keyword))
    );
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: filteredRecords,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};
exports.transaction = (req, res, next) => {
  let id = req.params.id;
  const filePath = path.join(__dirname, "../../data/transaction.json");
  let transactions = [];
  let recordSet = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    transactions = JSON.parse(data);
    if (transactions.length > 0) {
      recordSet = transactions.filter((record) => record.customerId === id);
    }
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: recordSet,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};
