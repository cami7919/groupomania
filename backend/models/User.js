const mongoose = require('mongoose');
const {isEmail}= require ('validator');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    pseudo:{type:String, required : true, minLength: 3, maxLength: 35, unique: true,
        trim: true},
    email: {type: String, required : true, unique : true},
    password: {type: String, required : true}
});

userSchema.plugin(uniqueValidator);

// const userSchema = mongoose.Schema({
//     email: {type: String, required : true, unique : true, lowercase:true, validate:[isEmail]},
//     password: {type: String, required : true},
//     // pseudo : {type:String, required: true, minLength:5, maxLength:1555, unique:true, trim:true},
//     bio : {type:String, max:250},
//     picture:{type:String, default: "./uploads/profil/avatar_random.jpg"}
//     // admin :{type: Boolean, required :true}
// },
// {
// timestamps:true})

userSchema.plugin(uniqueValidator);

module.exports =mongoose.model('User', userSchema);