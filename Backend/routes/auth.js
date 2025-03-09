const router = require("express").Router();
const { User } = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Token=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

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

  //          //resend link if not verified
  //       if (!user.verified) {
	// 		let token = await Token.findOne({ userId: user._id });
	// 		if (!token) {
	// 			token =  new Token({
	// 				userId: user._id,
	// 				token: crypto.randomBytes(32).toString("hex"),
	// 			}).save();
	// 			const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
	// 			await sendEmail(user.email, "Verify Email", url);
	// 		}

	// 		return res
	// 			.status(400)
	// 			.send({ message: "An Email sent to your account please verify" });
	// 	}


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
