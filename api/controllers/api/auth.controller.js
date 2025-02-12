const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  const filePath = path.join(__dirname, "../../data/employee.json");

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Email and password are required.",
    });
  }

  let employees = [];
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      employees = JSON.parse(data);
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Error parsing data.",
      });
      employees = [];
    }
  }

  const employee = employees.find((e) => e.email === email);

  if (!employee) {
    return res.status(401).json({
      status: false,
      message: "Email and Password are mismatched.",
    });
  }

  const match = await bcrypt.compare(password, employee.password);
  if (!match) {
    res.status(401).json({
      status: false,
      message: "Email and Password are mismatched.",
    });
  } else {
    let userObj = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
    };
    jwt.sign(
      { user: userObj },
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          res.status(400).json({
            status: false,
            message: "Error generating token.",
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Login successfull.",
            token: token,
          });
        }
      }
    );
  }
};
