const router = require("express").Router();
const { User } = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //  Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    //  Compare Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    //generate JWT token

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in Successfully" });
    console.log("Generated Token:", token);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
