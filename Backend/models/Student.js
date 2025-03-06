const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");


//create schema
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    
});

studentSchema.methods.generateAuthToken=function(){
   const token = jwt.sign({_id: this._id}, process.env.JWTSECRETKEY,{expiresIn:"7d"})
   return token
}

const Student = mongoose.model('Student', studentSchema);

const validate=(data)=>{
    const schema=Joi.object({
        firstName:Joi.string().required().label("First Name"),
        lastName:Joi.string().required().label("Last Name"),
        age:Joi.number().required().label("Age"),
        email:Joi.string().required().label("Email"),
        password:Joi.string().required().label("Password"),
        
    });
    return schema.validate(data);
};

module.exports={Student,validate};