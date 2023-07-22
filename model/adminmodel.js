const mongoose = require('mongoose');
const adminschema = new mongoose.Schema({
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

module.exports = mongoose.model('admin', adminschema);