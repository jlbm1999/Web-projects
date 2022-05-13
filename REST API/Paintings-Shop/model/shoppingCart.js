
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    qty: {type: Number, required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},   
    total: {type: Number, required: true}
});

module.exports = mongoose.model('ShoppingCart', schema);