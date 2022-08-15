const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')
const { registerValidation, loginValidation } = require("../validation");
const user = require("../model/user");

router.post("/register", async (req, res) => {
  //validate dayta before making user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check if user exitsts in db
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("email already exists");
  // hashing passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});
/*-----------------------------------------------------------------------------------*/
//login
router.post("/login", async (req, res) => {
  //validate dayta before making user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email exitsts in db
  const userExists = await User.findOne({ email: req.body.email });
  if (!userExists) return res.status(400).send("wrong email or password ");
  //check if password is correct
  const validpass = await bcrypt.compare(
    req.body.password,
    userExists.password
  );
  if (!validpass) return res.status(400).send("invalid password");
  
  //create and assign a token
  const token =jwt.sign({_id:user._id},process.env.TOkEN_SECRET)
  res.header('auth-token',token).send(token);
  
  res.send("you're loggied in !");
});
module.exports = router;
