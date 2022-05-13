// Model that works as a database
var mongoose = require('mongoose');
var User = require('./user');
var ShoppingCart = require('./shoppingCart')
var Product = require('./product');
var Order = require('./order');

Model = {}

Model.user = null;
Model.items = 0;
Model.cartItem = [];

Model.getProducts = function (){
    return Product.find();
};

// Function to register a user according to the database
Model.signin = function (email, password){
    return User.findOne({email, password});
}

// Function to sign out a user from the page
Model.signout = function() {
    Model.user = null;      // No user is connected
}

// Function ro register a new user with sign up
Model.signup = function(name, surname, address, birth, email, password){
    return User.findOne({email: email}).then(function (user){
        if (!user){
            var user = new User({
                email: email,
                password: password,
                name: name,
                surname: surname,
                birth: (new Date(birth)).getTime(),
                address: address,
                shoppingCart: [],
                orders: []
            });
            return user.save();
        }
        return null;
    });
};

// Returns user 
Model.getUserById = function (id){
    return User.find({_id: id});
};

// Returns qty of items in the cart
Model.getCartQty = function (id){
    return User.aggregate([
        {$match: {"_id": mongoose.Types.ObjectId(id)}},
        {$lookup: {from: 'shoppingcarts', localField: 'shoppingCart', foreignField: '_id', as: 'shoppingCart'}},
        {$project: {qty: {$sum: "$shoppingCart.qty"}}}
    ]);

};

Model.getProductById = function (id){
    return Product.findOne({_id: id});
};

// Add product to the shopping cart
Model.addItem = function (uid, pid){
    return Promise.all([User.findById(uid).populate('shoppingCart'), Product.findById(pid)]).then(function (results){
        var user = results[0];
        var product = results[1];

        if (user && product){
            for (let i = 0; i < user.shoppingCart.length; i++){
                var item = user.shoppingCart[i];
                if (item.product == pid){
                    item.qty++;
                    item.total = item.total + product.price;
                    return item.save().then(function (){
                        return user.shoppingCart;
                    });
                }
            }
            var items = new ShoppingCart({qty: 1, product: product, total: product.price});
            user.shoppingCart.push(items);
            return Promise.all([items.save(), user.save()]).then(function (result){
                return result[1].shoppingCart;
            });
        }
        return null
    }).catch(function (err){ console.log(err); return null});
};

Model.getCartByUserId = function (id){
    return User.findById(id).then(function (user){
        if (user){
            return user.populate({
                path: 'shoppingCart',
                populate: {path: 'product'}
            }).then(function (user){
                return user.shoppingCart;
            });
        }
        return null;
    })
};

Model.getProfileByUserId = function (id){
    return User.findById(id).then(function (user){
        if (user){
            return user;
        }
    })
};

Model.getOrdersByUserId = function(id){
    return User.findById(id).then(function (user){
        if (user){
            return user.populate({
                path: 'orders',
                populate: {path: 'orderItems'}
            }).then(function (user){
                return user.orders;
            });
        }
        return null;
    })
};

Model.removeItem = function (uid, pid, all){
    return User.findById(uid).populate('shoppingCart').then(function (user){
        if (user){
            for (let i = 0; i < user.shoppingCart.length; i++){
                var product = user.shoppingCart[i];
                if (product.product._id == pid){
                    if (!all && product.qty > 1){
                        return ShoppingCart.findById({_id: product._id}).populate('product').then(function (cart){
                            cart.qty--;
                            cart.total = cart.total - cart.product.price;
                            return cart.save();
                        })   
                    }
                    else{
                        user.shoppingCart.splice(i, 1);
                        return ShoppingCart.deleteOne({_id: product._id}).then(function (){
                            return user.save().then(function (user){
                                return user.shoppingCart;
                            });
                        });
                    }
                }
            }
        }
        return null;
    })
};

// Function when checkout is pressed in purchase
Model.checkout = function(id, date, address, cardnumber, cardowner){
    return User.findById(id).populate('shoppingCart').then(function (user){
        var order = new Order({
            date: date,
            address: address,
            cardnumber: cardnumber,
            cardowner: cardowner,
            orderItems: user.shoppingCart
        });

        user.shoppingCart = []
        user.orders.push(order)
        return Promise.all([order.save(), user.save()]).then(function (result){
            return result[1].orders[result[1].orders.length - 1];
        });
    });
};

Model.getOrder = function(uid, oid){
    return User.findById(uid).then(function (user){
        return user.populate({
            path: 'orders',
            populate: {path: 'orderItems', populate: {path: 'product'}}
        })
        .then(function (user){
            for (let i of user.orders){
                if (i._id == oid){
                    return i
                }
            }
        })
    });
};


module.exports = Model;



