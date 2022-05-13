// Model that works as a database

Model = {}

Model.getProducts = function (){
    return $.ajax({
        url: '/api/products',
        method: 'GET'
    });
};

Model.signin = function (email, password){
    return $.ajax({
        url: '/api/users/signin',
        method: 'POST',
        data: {email, password}
    });
};

Model.signup = function (name, surname, address, birth, email, password, confirmpassword){
    return $.ajax({
        url: '/api/users/signup',
        method: 'POST',
        data: {name, surname, address, birth, email, password, confirmpassword}
    });
};

Model.signout = function (){
    document.cookie = 'token=;expires=0;path=/;'
};

Model.getUserId = function (){
    var uid = RegExp('uid=[^;]+').exec(document.cookie);
    if (uid){
        uid = decodeURIComponent(uid[0].replace(/^[^=]+./,""));
        return uid;
    }
    return null;
};

Model.getCartQty = function (){
    return $.ajax({
        url: '/api/cart/qty',
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }    
    });
};

Model.addItem = function (id){
    return $.ajax({
        url: 'api/cart/items/product/' + id,
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.getCart = function (){
    return $.ajax({
        url: '/api/cart',
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.getProfile = function (){
    return $.ajax({
        url: '/api/users/profile',
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
}

Model.getOrders = function (){
    return $.ajax({
        url: '/api/orders',
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.removeItem = function (pid, all){
    return $.ajax({
        url: '/api/cart/items/product/' + pid + (all ? '/all' : ''),
        method: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.checkout = function(date, address, cardnumber, cardowner){
    return $.ajax({
        url: '/api/orders',
        method: 'POST',
        data: {date, address, cardnumber, cardowner},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.getOrder = function(oid){
    return $.ajax({
        url: '/api/orders/id/' + oid,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Model.getToken());
        }
    });
};

Model.getToken = function () {
    var token = RegExp('token=[^;]+').exec(document.cookie);
    if (token) {
        token = decodeURIComponent(token[0].replace(/^[^=]+./,""));
        return token;
    }
    return null;
};
