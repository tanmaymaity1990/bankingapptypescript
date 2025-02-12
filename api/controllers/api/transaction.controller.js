const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

exports.manage = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/transaction.json");
  let transactions = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    transactions = JSON.parse(data);
    res.status(200).json({
      status: true,
      message: "Record fetched Successfully.",
      result: transactions,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
};

exports.insert = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/transaction.json");
  let transactionData = {
    id: uuidv4(),
    customerId: req.body.customerId,
    fromAccount: req.body.fromAccount,
    toAccount: req.body.toAccount,
    amount: req.body.amount,
    created: moment().format("D-MM-YYYY"),
  };
  let transactions = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    transactions = JSON.parse(data);
  }
  transactions.push(transactionData);
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2), "utf8");
  res.status(201).json({
    status: true,
    message: "Record added successfully.",
  });
};

exports.limit = (req, res, next) => {
  let limit = req.params.limit;
  const filePath = path.join(__dirname, "../../data/transaction.json");
  let transactions = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    transactions = JSON.parse(data);
    const record = transactions.slice(-limit);
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

function getOverSpentCustomers(customers, transactions) {
  return customers
    .map((customer) => {
      const outgoingTransactions = transactions.filter(
        (transaction) =>
          transaction.customerId === customer.id &&
          transaction.fromAccount === customer.accountNo
      );

      let totalSpend = 0;

      outgoingTransactions.forEach((transaction) => {
        totalSpend += transaction.amount;
      });

      return {
        ...customer,
        totalSpend: totalSpend,
        overdueAmount: Math.max(0, totalSpend - customer.amountLimit),
      };
    })
    .filter((customer) => customer.totalSpend > customer.amountLimit);
}

exports.overdue = (req, res, next) => {
  const filePath = path.join(__dirname, "../../data/transaction.json");
  const filePath2 = path.join(__dirname, "../../data/customer.json");
  let transactions = [];
  let customers = [];
  if (fs.existsSync(filePath2)) {
    const customerdata = fs.readFileSync(filePath2, "utf8");
    customers = JSON.parse(customerdata);
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    transactions = JSON.parse(data);
  } else {
    res.status(404).json({
      status: false,
      message: "Error retrieving data.",
    });
  }
  const result = getOverSpentCustomers(customers, transactions);
  res.status(200).json({
    status: true,
    message: "Record fetched Successfully.",
    result: result,
  });
};
