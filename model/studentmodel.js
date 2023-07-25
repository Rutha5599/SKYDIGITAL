const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    studentname: {
        type: String
    },
    fathername: {
        type: String
    },
    studentemailid: {
        type: String
    },
    studentaddress: {
        type: String
    },
    studentpassword: {
        type: String
    },
    studentmobile:{
        type:Number
    },
    fathermobile:{
        type:Number
    },
    banchtime:{
        type:String
    },
    course:{
        type:String
    },
    addmisiondate:{
        type:String
    },
    fees:{
        type:String
    },
    pendingfees:{
        type:Number,
        default:0
    },
    paidfees:{
        type:Number,
        default:0
    },
    img:{
        type:String
    },
    img_id:{
        type:String
    }
});

module.exports = mongoose.model('student', studentSchema);