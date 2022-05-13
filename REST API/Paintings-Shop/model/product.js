var mongoose = require('mongoose');

var schema = mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String, required: true},
    size: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', schema);
