const mongoose = require('mongoose');
const studentfeesSchema = new mongoose.Schema({
    feesamount: {
        type: String
    },
    student_id: {
        type: String
    },
    date: {
        type: String
    },
    paymenttype: {
        type: String
    },
});

module.exports = mongoose.model('studentfees', studentfeesSchema);