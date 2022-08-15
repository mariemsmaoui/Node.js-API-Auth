const router = require("express").Router();
const User = require("../model/user");
const bcrypt=require('bcryptjs')
const { registerValidation, loginValidation } = require("../routes/validation");

router.post("/register", async (req, res) => {
  //validate dayta before making user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check if user exitsts in db
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("email already exists");
  // hashing passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword ,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
