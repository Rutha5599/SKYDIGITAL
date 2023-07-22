const mongoose = require('mongoose');
const managerSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    img:{
        type:String
    },
    img_id:{
        type:String
    }
});

module.exports = mongoose.model('manager', managerSchema);