// The required packages
const router = require("express").Router();
const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authLockedRoute = require("./authLockedRoute");

// POST /accounts/register -- Create a new account.
router.post("/register", async (req, res) => {
  try {
    /// The DB is checked for a duplicate account. 
    const findAccount = await db.Account.findOne({
      email: req.body.email,
    });

    // An account cannot be created twice.
    if (findAccount) {
      return res.status(400).json({ msg: "email exists already" });
    }
    // The account's password is hashed.
    const password = req.body.password;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // A new account is created with the hashed password.
    const newAccount = new db.Account({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newAccount.save();
    // The account is signed in.
    // The jwt payload is created.
    const payload = {
      name: newAccount.name,
      email: newAccount.email,
      id: newAccount.id,
    }
    // The token is signed and sent back.
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })
    res.json({ token });
  } catch (err) {
    console.warn(err);
    // This handles validation errors.
    if (err.name === "ValidationError") {
      res.status(400).json({ msg: err.message });
    } else {
      // This handles all other errors.
      res.status(500).json({ msg: "server error 500 😡" });
    }
    res.status(500).json(err);
  }
});

// POST /accounts/login -- Validate the login credentials.
router.post("/login", async (req, res) => {
  try {
    // The data will come in on the req.body.
    console.log(req.body);
    // The account is searched for in the DB.
    const findAccount = await db.Account.findOne({
      email: req.body.email,
    });

    // If the account is not found, a status of 400 is sent.
    // The account is sent an error message.
    if (!findAccount) {
      return res.status(400).json({ msg: "Invalid Login" });
    }
 
    // The supplied password is checked to see if it matched the password in the DB.
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      findAccount.password
    )
    // If they don't match, return and let the account know that login has failed.
    if (!passwordCheck) {
      return res.status(400).json({ msg: "Invalid Login " });
    }
    // A jwt payload is created.
    const payload = {
      name: findAccount.name,
      email: findAccount.email,
      id: findAccount.id,
    };
    // The jwt is signed and sent back.
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })
    res.json({ token })
  } catch (err) {
    console.log(err)
  }
})

// GET /auth-locked -- Check account credentials and only sends back privilaged information if account is properly logged in.
router.get("/auth-locked", authLockedRoute, (req, res) => {
  console.log("the current account is ", res.locals.account)
  res.json({ msg: "welcome to the secret auth-locked route 🕵🏻‍♂️" })
})

router.get("/:id", authLockedRoute, async (req, res) => {
  try {
    const account = await db.Account.findById(req.params.id)
      .populate({path: 'tasks', populate: {path: 'profile'}})
      .populate("profiles");
    res.json(account);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
