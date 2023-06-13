/////////////////////////////////////////////////////////////////////
/////////save btn in add_user.ejs ///////////////////////////////////
$("#add_user").submit(function(event){
    alert("User data Inserted Successfully!");
})
//////////////////////////////////////////////////////////////////////
///////// save btn in admin_show_all_users.ejs ///////////////////////

$(".form").submit(function(event){
    event.preventDefault();
    if(window.location.pathname == "/api/users/admin_show_all_users"){
    var unindexed_array = $(this).serializeArray();
    var user = {}

    $.map(unindexed_array, function(n, i){
        user[n['name']] = n['value'];
    })


    var request = {
        "url" : `http://localhost:5000/api/users/${user.id}`,
        "method" : "PUT",
        "data" : user ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })
    
}})
///////////////////////////////////////////////////////////////////////
/////////////// delete btn in admin_show_all_users.ejs ////////////////
if(window.location.pathname == "/api/users/admin_show_all_users"){
    var ondelete = $(".table tbody td a.delete");
    ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:5000/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            });
        };

    });
};
//////////////////////////////////////////////////////////////////////////////////////
////////////// save btn in profile.ejs (user updates his profile OR //////////////////
//////or admin search by mob. no. IN admin_show_all_users.ejs then updates a user ////
//////////////////////////////////////////////////////////////////////////////////////

$("#profile").submit(function(event){
    event.preventDefault();
    //if(window.location.pathname == "/api/users/profile" ||window.location.pathname == "/api/users/profile/search_by_mob?mob"){
    var unindexed_array = $(this).serializeArray();
    var user = {}

    $.map(unindexed_array, function(n, i){
        user[n['name']] = n['value'];
    })


    var request = {
        "url" : `http://localhost:5000/api/users/${user.id}`,
        "method" : "PUT",
        "data" : user ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })
    
//}
})
////////////////////////////////////////////////////////////
///////// save btn in admin_add_product.ejs ////////////////
$("#add_product").submit(function(event){
    alert("Product Inserted Successfully!");
})
/////////////////////////////////////////////////////////////
/////////save btn in admin_show_all_products.ejs ////////////

$(".form").submit(function(event){
    event.preventDefault();
    if(window.location.pathname == "/api/products/admin_show_all_products" || window.location.pathname == "/api/products/active_products" || window.location.pathname == "/api/products/in_active_products"){
    var unindexed_array = $(this).serializeArray();
    var product = {};

    $.map(unindexed_array, function(n, i){
        product[n['name']] = n['value'];
    })


    var request = {
        "url" : `http://localhost:5000/api/products/${product.id}`,
        "method" : "PUT",
        "data" : product ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Products Updated Successfully!");
    })
    
}})
//////////////////////////////////////////////////////////////
//////////// delete btn in admin_show_all_products.ejs ///////
if(window.location.pathname == "/api/products/admin_show_all_products" || window.location.pathname == "/api/products/active_products" || window.location.pathname == "/api/products/in_active_products"){
    var ondelete = $(".table tbody td a.delete");
    ondelete.click(function(){
        var product_id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:5000/api/products/${product_id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}
///////////////////////////////////////////////////////////////////
/////////Add to Cart btn in user_show_all_products.ejs ////////////

$(".form").submit(function(event){
    event.preventDefault();
    if(window.location.pathname == "/api/products/user_show_all_products" || window.location.pathname =="/api/products/search_by_category" || window.location.pathname =="/api/products/search_by_title"|| window.location.pathname =="/api/products/search_by_newest"){
    var unindexed_array = $(this).serializeArray();
    var cartData = {};

    $.map(unindexed_array, function(n, i){
        cartData[n['name']] = n['value'];
    })


    var request = {
        "url" : 'http://localhost:5000/api/carts',
        "method" : "POST",
        "data" : cartData ///this is a PART of the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("item added Successfully!");
        location.reload();
    })
}});
/////////////////////////////////////////////////////////////
//////////// save quantity in user_show_cart.ejs ////////////

$(".form").submit(function(event){
    event.preventDefault();
    if(window.location.pathname == "/api/carts/user_show_cart"){
    var unindexed_array = $(this).serializeArray();
    var cart = {};

    $.map(unindexed_array, function(n, i){
        cart[n['name']] = n['value'];
    })

    var request = {
        "url" : `http://localhost:5000/api/carts/${cart.id}`,
        "method" : "PUT",
        "data" : cart ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Cart Updated Successfully!");
        location.reload();
    })
    
}});
/////////////////////////////////////////////////////////////////////////
////////// delete a product from Cart btn in user_show_cart.ejs /////////  no change
$("a.delete-product").click(function(event){
     event.preventDefault();
    if(window.location.pathname == "/api/carts/user_show_cart"){       
        var cartId = $(this).attr("cart-id");
        var productId = $(this).attr("product-id")
        var request = {
            "url" : `http://localhost:5000/api/carts/delete_product/${cartId}/${productId}`, //req.params.cartId and req.params.productId
            "method" : "PUT",
            "data":""
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    }
});
//////////////////////////////////////////////////////////////////////
/////////////// delete Cart btn in user_show_cart.ejs //////////////// no change
if(window.location.pathname == "/api/carts/user_show_cart"){
    var ondelete = $(".delete-cart");
    ondelete.click(function(){
        var id = $(this).attr("cart-id")

        var request = {
            "url" : `http://localhost:5000/api/carts/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}
//////////////////////////////////////////////////////////////////////////////
//////////////////// place order btn in user_show_order.ejs //////////////////

$(".formOrder").submit(function(event){
    event.preventDefault();
    var cartId =$(".cartId").attr("value");

    if(window.location.pathname == `/api/orders/user_show_order/${cartId}`){
        var unindexed_array = $(this).serializeArray();
        var orderData = {};

        $.map(unindexed_array, function(n, i){
            orderData[n['name']] = n['value'];
        })

        if ($("#radio-1").is(':checked')){ ////// PaymentMethod = 'cashOnDelivery'
            //let PaymentMethod = 'cashOnDelivery';
            var request = {
                "url" : `http://localhost:5000/api/orders/`,
                "method" : "POST",
                "data" : orderData 
            }

            $.ajax(request).done(function(response){
                alert("item added Successfully!");
                location.reload();
            })
        }
        /////////////////// Strip ////////////////////////////////////////
        else if ($("#radio-2").is(':checked')){

            window.location.pathname = `/api/stripe/${orderData.cartId}`;
        }
    }    
});
//////////////////////////////////////////////////////////////////////////////
/////////////// delete btn in Admin_show_all_orders.ejs //////////////////////
if(window.location.pathname == "/api/orders/admin_show_all_orders"){
    var ondelete = $(".table tbody td a.delete");
    ondelete.click(function(){
        var cart_id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:5000/api/orders/delete/${cart_id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this order?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}