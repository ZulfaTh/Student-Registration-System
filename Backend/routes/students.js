const router = require("express").Router();
const {Student, validate} = require('../models/Student');
const bcrypt=require("bcrypt");

/// Register a new student
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const existingStudent = await Student.findOne({ email: req.body.email });
        if (existingStudent)
            return res.status(409).send({ message: "Student with given email already exists" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newStudent = new Student({
            ...req.body,
            password: hashedPassword, // Set the hashed password here
        });

        await newStudent.save(); // Save the new student to the database
        res.status(201).send({ message: "Student Added Successfully" });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new student
router.post('/students', async (req, res) => {
    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        
    });
    
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Other routes like update, delete can be added similarly...

module.exports = router;
