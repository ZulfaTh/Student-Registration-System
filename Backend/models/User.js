const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Create schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return (
          this.role !== "student" || (value !== null && value !== undefined)
        );
      },
      message: "Age is required for students.",
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  adminCode: {
    type: String,
    default: "",
    validate: {
      validator: function (value) {
        return this.role !== "teacher" || (value && value.trim() !== "");
      },
      message: "Admin code is required for teachers.",
    },
  },
  verified: { type: Boolean, default: false },
  profilePicture: {
    type: String,
    default: "http://localhost:8080/Images/defaultProfile.jpg",
  },
  marks: {
    type: Object,
    default: function () {
      return this.role === "student"
        ? {
            subject1: 0,
            subject2: 0,
            subject3: 0,
            subject4: 0,
            subject5: 0,
            subject6: 0,
            subject7: 0,
            subject8: 0,
            subject9: 0,
          }
        : undefined;
    },
    validate: {
      validator: function (value) {
        return this.role !== "teacher" || value === undefined;
      },
      message: "Teachers should not have marks.",
    },
  },
});

//  Remove Unwanted Fields
userSchema.pre("save", function (next) {
  if (this.role === "student") {
    this.adminCode = undefined; // Remove adminCode if the role is student
  } else if (this.role === "teacher") {
    this.marks = undefined; // Remove marks if the role is teacher
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const secretKey = process.env.JWTSECRETKEY || "defaultSecretKey";
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      email: this.email,
      role: this.role,
      profilePicture: this.profilePicture,
      marks: this.role === "student" ? this.marks : undefined, 
    },
    secretKey,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("user", userSchema);

// Validate user data with Joi
const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    age: Joi.when("role", {
      is: "student",
      then: Joi.number().integer().min(1).required(),
      otherwise: Joi.forbidden(),
    }),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity({
      min: 8,
      max: 15,
      upperCase:1
    })
      .required()
      .label("Password"),
    role: Joi.string().valid("student", "teacher").required(),
    adminCode: Joi.when("role", {
      is: "teacher",
      then: Joi.string().required().label("Admin Code"),
      otherwise: Joi.forbidden(),
    }),
    profilePicture: Joi.string().uri().optional().label("Profile Picture"),
    marks: Joi.when("role", {
      is: "student",
      then: Joi.object({
        subject1: Joi.number().integer().min(0).max(100).optional(),
        subject2: Joi.number().integer().min(0).max(100).optional(),
        subject3: Joi.number().integer().min(0).max(100).optional(),
        subject4: Joi.number().integer().min(0).max(100).optional(),
        subject5: Joi.number().integer().min(0).max(100).optional(),
        subject6: Joi.number().integer().min(0).max(100).optional(),
        subject7: Joi.number().integer().min(0).max(100).optional(),
        subject8: Joi.number().integer().min(0).max(100).optional(),
        subject9: Joi.number().integer().min(0).max(100).optional(),
      }).optional(),
      otherwise: Joi.forbidden(),
    }),
  });

  return schema.validate(data);
};

module.exports.User = User;
module.exports.validate = validate;
