const router = require("express").Router();
const checkApiKey = require("../../middleware/api/checkApiKey");
const checkToken = require("../../middleware/api/checkToken");
const employeeController = require("../../controllers/api/employee.controller");
const authController = require("../../controllers/api/auth.controller");
const customerController = require("../../controllers/api/customer.controller");
const transactionController = require("../../controllers/api/transaction.controller");

router.get("/", checkApiKey, (req, res) => {
  res
    .status(401)
    .json({ message: "You donot have permission to access this page." });
});
router.get("/employees", checkApiKey, checkToken, employeeController.manage);
router.post("/employee", checkApiKey, checkToken, employeeController.insert);

router.post("/login", checkApiKey, authController.login);

router.get("/customers", checkApiKey, checkToken, customerController.manage);
router.post("/customer", checkApiKey, checkToken, customerController.insert);
router.put("/customer/:id", checkApiKey, checkToken, customerController.update);
router.get("/customer/:id", checkApiKey, checkToken, customerController.view);
router.get(
  "/customer/search/:keyword",
  checkApiKey,
  checkToken,
  customerController.search
);
router.get(
  "/customer/transaction/:id",
  checkApiKey,
  checkToken,
  customerController.transaction
);
router.get(
  "/transactions",
  checkApiKey,
  checkToken,
  transactionController.manage
);
router.post(
  "/transaction",
  checkApiKey,
  checkToken,
  transactionController.insert
);
router.get(
  "/transaction/limit/:limit",
  checkApiKey,
  checkToken,
  transactionController.limit
);
router.get(
  "/transaction/overdue",
  checkApiKey,
  checkToken,
  transactionController.overdue
);

module.exports = router;
