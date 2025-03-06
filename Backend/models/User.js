const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

// Create schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { 
    type: Number, 
    required: function() {
      return this.role === 'student'; // Age is required only if the role is 'student'
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  adminCode: { 
    type: String, 
    default: "", 
    required: function() {
      return this.role === 'teacher'; // Admin code is required only if the role is 'teacher'
    },
  },
  verified: { type: Boolean, default: false },
});

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, firstName: this.firstName, role: this.role }, process.env.JWTSECRETKEY, {expiresIn: "7d"});
  return token;
};

const User = mongoose.model('user', userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    age: Joi.when('role', { 
      is: 'student', 
      then: Joi.number().integer().min(1).required(), 
      otherwise: Joi.forbidden(), // Age is forbidden for teachers
    }),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().valid('student', 'teacher').required(),
    adminCode: Joi.when('role', {
      is: 'teacher', 
      then: Joi.string().required().label("Admin Code"),
      otherwise: Joi.string().allow('').optional(),
    }),
  });

  return schema.validate(data);
};

module.exports = { User, validate };
