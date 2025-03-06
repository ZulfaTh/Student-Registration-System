const router = require("express").Router();
const {User, validate} = require('../models/User');
const bcrypt=require("bcrypt");

/// Register a new User
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser)
            return res.status(409).send({ message: "User with given email already exists" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hashedPassword, // Set the hashed password here
        });

        await newUser.save(); // Save the new User to the database
        res.status(201).send({ message: "User Added Successfully" });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get all Users
router.get('/Users', async (req, res) => {
    try {
        const Users = await User.find();
        res.json(Users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new User
router.post('/Users', async (req, res) => {
    const User = new User({
        name: req.body.name,
        age: req.body.age,
        
    });
    
    try {
        const newUser = await User.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Other routes like update, delete can be added similarly...

module.exports = router;
