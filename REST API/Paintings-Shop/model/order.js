var mongoose = require('mongoose');

var schema = mongoose.Schema({
    date: {type: Date, required: true},
    address: {type: String, required: true},
    cardnumber: {type: Number, required: true},
    cardowner: {type: String, required: true},
    orderItems: [{type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingCart'}],
});

module.exports = mongoose.model('Order', schema);
