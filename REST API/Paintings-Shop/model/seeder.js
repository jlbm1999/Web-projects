
var mongoose = require('mongoose');
var User = require('./user');
var ShoppingCart = require('./shoppingCart');
var Product = require('./product');
var Order = require('./order');
var bcryptjs = require('bcryptjs');


mongoose.Promise = global.Promise;

var uri = 'mongodb://127.0.0.1/paintings-shop'
var db = mongoose.connection;

db.on('connecting', function(){console.log('Connecting to', uri);});
db.on('connected', function(){console.log('Connected to', uri);});
db.on('disconnecting', function(){console.log('Disconnecting to', uri);});
db.on('disconnected', function(){console.log('Disconnected to', uri);});
db.on('error', function(){console.log('Error:', err.message);});

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(function (){
    
    var shoppingCart = []

    var orderItems = []

    var user = new User({
        email: 'jl@example.com',
        password: bcryptjs.hashSync('1', bcryptjs.genSaltSync()),
        name: 'José Luis',
        surname: 'Bernáldez',
        birth: new Date(1999, 1, 1),
        address: 'Tinte 38 5B',
        shoppingCart: shoppingCart,
        orders: orderItems
    });

    var products = [
        new Product({
            title: 'Aubergine and Gold',
            url: '../pictures/p1.jpg',
            description: 'It is when purple and gold come together on a single canvas that works as evocative as Aubergine and Gold emerge.',
            size: '28 x 21 cm',
            price: 49
        }),
        new Product({
            title: 'Comedy',
            url: '../pictures/p2.jpg',
            description: 'Laughter is present as the protagonist of this painting entitled Comedy.',
            size: '23 x 30 cm',
            price: 49
        }),
        new Product({
            title: 'Seed',
            url: '../pictures/p3.jpeg',
            description: 'Just as any other plant would do, the painting entitled Seed shows us the birth of the work as if it were a blossoming, going from the green roots and stem of a plant to the amazing purple colours of its flowers.',
            size: '29 x 42 cm',
            price: 65
        }),
        new Product({
            title: 'Emerald Drop',
            url: '../pictures/p4.jpg',
            description: 'Experts say that emeralds are the most beautiful jewels in the world. In this painting called Emerald Drop, the luminosity and fragility of this precious stone are most faithfully depicted.',
            size: '28 x 21 cm',
            price: 49
        }),
        new Product({
            title: 'Loving Energy',
            url: '../pictures/p5.jpg',
            description: 'Let the warm love of your loved ones envelop you as you contemplate Loving Energy, filling your home and your heart with joy.',
            size: '28 x 21 cm',
            price: 35
        }),
        new Product({
            title: 'Bloom',
            url: '../pictures/p6.jpeg',
            description: 'Flowers, nature and its beauty are represented here in Bloom. This new circular treatment allows the author to condense the idea behind the painting so you can just focus on the colors and enjoy the views.',
            size: '21 x 21 cm',
            price: 35
        }),
        new Product({
            title: 'Cell',
            url: '../pictures/p7.jpg',
            description: 'Like any living thing, Cell develops around a central point or nucleus, from which its shapes and colours expand as if it were a real cell. In this case, we could say that it represents a eukaryotic type of cell, which is not surprising given the author\'s sympathy for plants.',
            size: '23 x 30 cm',
            price: 49
        }),
        new Product({
            title: 'Vertical Grey',
            url: '../pictures/p8.jpeg',
            description: 'Vertical Grey is a new representation of our artist\'s ingenuity. In this innovative painting one can see the desire to explore new forms of expression, embracing new colours and new forms, and introducing its author to a new line of paintings that seek to captivate the viewer by their lines and not by their composition.',
            size: '29 x 21 cm',
            price: 99
        })   
    ]

    return ShoppingCart.deleteMany()
    .then(function () { return User.deleteMany(); })
    .then(function () { return Order.deleteMany(); })           
    .then(function () { return user.save(); })
    .then(function () { return Product.deleteMany(); })
    .then(function () { return Product.insertMany(products); })
    .then(function () { return mongoose.disconnect(); });

    }).catch(function (err){
        console.log('Error:', err.message);
        return mongoose.disconnect();
});
