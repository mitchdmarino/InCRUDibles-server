const router = require("express").Router();
const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authLockedRoute = require("./authLockedRoute");

// POST /accounts/register -- CREATE a new account
router.post("/register", async (req, res) => {
  try {
    /// check if the account exists already
    const findAccount = await db.Account.findOne({
      email: req.body.email,
    });

    // disallow accounts from registerring twice
    if (findAccount) {
      return res.status(400).json({ msg: "email exists already" });
    }
    // hash the account's password
    const password = req.body.password;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create a new account with the hashed password
    const newAccount = new db.Account({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newAccount.save();
    // sign the account in
    // create the jwt payload
    const payload = {
      name: newAccount.name,
      email: newAccount.email,
      id: newAccount.id,
    };
    // sign the token and send it back
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // expires in one day
    res.json({ token });
  } catch (err) {
    console.warn(err);
    // handle validation errors
    if (err.name === "ValidationError") {
      res.status(400).json({ msg: err.message });
    } else {
      // handle all other errors
      res.status(500).json({ msg: "server error 500 😡" });
    }
    res.status(500).json(err);
  }
});

// POST /accounts/login -- validate the login credentials
router.post("/login", async (req, res) => {
  try {
    // all the data will come in on the req.body
    console.log(req.body);
    // try to find the account in the database
    const findAccount = await db.Account.findOne({
      email: req.body.email,
    });

    // if the account is not found, send a status of 400 and let the account know login failed
    if (!findAccount) {
      return res.status(400).json({ msg: "Invalid Login" });
    }
    // console.log(findaccount)
    // Check if the supplied password matches the hash in the db
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      findAccount.password
    );
    // console.log(passwordCheck)
    // if they do not match, return and let the account know that login has failed
    if (!passwordCheck) {
      return res.status(400).json({ msg: "Invalid Login " });
    }
    // Create a jwt payload
    const payload = {
      name: findAccount.name,
      email: findAccount.email,
      id: findAccount.id,
    };
    // sign the jwt and send it back
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // expires in one day
    res.json({ token });
  } catch (err) {
    console.log(err);
  }
});

// GET /auth-locked -- checks accounts credentials and only sends back privilaged information if account is logged in properly
router.get("/auth-locked", authLockedRoute, (req, res) => {
  console.log("the current account is ", res.locals.account);
  res.json({ msg: "welcome to the secret auth-locked route 🕵🏻‍♂️" });
});

router.get("/:id", authLockedRoute, async (req, res) => {
  try {
    console.log(req.params.id);
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
