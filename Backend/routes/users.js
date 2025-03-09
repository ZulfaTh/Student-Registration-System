const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Token=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");




// Register a new User
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message }); 
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "User with given email already exists" }); 
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with the provided data
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Generate verification token
    const token = await new Token({
      userId: newUser._id, // 
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    // Send verification link
    const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", url); 

    return res
      .status(201)
      .send({ message: "An email has been sent to verify your account." });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).send({ message: "Internal Server Error" }); 
  }
});


router.get("/:id/verify/:token/", async (req, res) => {
  	try {
  		const user = await User.findOne({ _id: req.params.id });
  		if (!user) return res.status(400).send({ message: "Invalid link" });
  
  		const token = await Token.findOne({
  			userId: user._id,
  			token: req.params.token,
  		});
  		if (!token) return res.status(400).send({ message: "Invalid link" });
  
  		await User.updateOne({ _id: user._id }, { $set: { verified: true } }); 

  		await token.remove();
  
  		res.status(200).send({ message: "Email verified successfully" });
  	} catch (error) {
  		res.status(500).send({ message: "Internal Server Error" });
  	}
  });

// Get users with optional filtering by role
router.get("/", async (req, res) => {
  try {
    const { role } = req.query; // Role passed as a query parameter
    const filter = role ? { role } : {}; // If role is provided, filter by it, else get all users
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user data
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;

    if (updatedData.password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    // Update the user document
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user by ID
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId); // Delete user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

module.exports = router;
