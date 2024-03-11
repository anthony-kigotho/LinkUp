const mssql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sqlConfig } = require("../Config/config");

const registerUser = async (req, res) => {
  try {
    const user_id = v4();
    const { display_name, username, email, password } = req.body;
    if (!display_name || !username || !email || !password) {
      return res.status(400).json({ error: "Please input all values" });
    }

    const pool = await mssql.connect(sqlConfig);

    //check if username exists
    const checkUser = await pool
      .request()
      .input("username", username)
      .execute("fetchUserByUsername");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({
        error: "Account creation failed! This username is already registered",
      });
    }

    const checkEmail = await pool
      .request()
      .input("email", email)
      .execute("fetchUserByEmail");
    if (checkEmail.rowsAffected[0] == 1) {
      return res.status(400).json({
        error: "Account creation failed! This email is already registered",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 5);

    const result = await pool
      .request()
      .input("user_id", mssql.VarChar, user_id)
      .input("display_name", mssql.VarChar, display_name)
      .input("username", mssql.VarChar, username)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedPwd)
      .execute("createNewUser");

    if (result.recordset.length > 0) {
      return res.status(201).json({ message: "Account created successfully" });
    } else {
      return res.status(400).json({ error: "Account creation failed" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error, ${error.message}` });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if username is registered
    const pool = await mssql.connect(sqlConfig);
    const user = await pool
      .request()
      .input("username", username)
      .execute("fetchUserByUsername");

    if (user.rowsAffected[0] == 0) {
      return res.status(400).json({ error: "This username is not registered" });
    } else {
      const valid = await bcrypt.compare(password, user.recordset[0].password);
      if (valid) {
        const token = jwt.sign(
          {
            email: user.recordset[0].email,
            display_name: user.recordset[0].display_name,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: 24 * 60 * 60,
          }
        );
        return res.status(200).json({
          message: "Login successful",
          token,
          user: user.recordset[0],
        });
      } else {
        return res.status(400).json({ error: "Invalid login credentials" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error, ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
