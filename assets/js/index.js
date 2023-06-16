/////////////////////////////////////////////////////////////////////
/////////save btn in add_user.ejs ///////////////////////////////////
$("#add_user").submit(function(event){
    alert("User data Inserted Successfully!");
})
//////////////////////////////////////////////////////////////////////
///////// save btn in admin_show_all_users.ejs ///////////////////////

$(".admin_show_all_users_form").submit(function(event){
    event.preventDefault();
    
    var unindexed_array = $(this).serializeArray();
    var user = {}

    $.map(unindexed_array, function(n, i){
        user[n['name']] = n['value'];
    })


    var request = {
        "url" : `https://onlineshop11.onrender.com/api/users/${user.id}`,
        "method" : "PUT",
        "data" : user ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })
    
})
///////////////////////////////////////////////////////////////////////
/////////////// delete btn in admin_show_all_users.ejs ////////////////

    var ondelete = $(".table tbody td a.admin_show_all_users_delete_user");
    ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `https://onlineshop11.onrender.com/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            });
        };

    });

//////////////////////////////////////////////////////////////////////////////////////
////////////// save btn in profile.ejs (user updates his profile OR //////////////////
//////or admin search by mob. no. IN admin_show_all_users.ejs then updates a user ////
//////////////////////////////////////////////////////////////////////////////////////

$("#profile").submit(function(event){
    event.preventDefault();
    var unindexed_array = $(this).serializeArray();
    var user = {}

    $.map(unindexed_array, function(n, i){
        user[n['name']] = n['value'];
    })

    var request = {
        "url" : `https://onlineshop11.onrender.com/api/users/${user.id}`,
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

$(".admin_show_all_products_form").submit(function(event){
    event.preventDefault();
    
    var unindexed_array = $(this).serializeArray();
    var product = {};

    $.map(unindexed_array, function(n, i){
        product[n['name']] = n['value'];
    })


    var request = {
        "url" : `https://onlineshop11.onrender.com/api/products/${product.id}`,
        "method" : "PUT",
        "data" : product ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Products Updated Successfully!");
    })
    
})
//////////////////////////////////////////////////////////////
//////////// delete btn in admin_show_all_products.ejs ///////

    var ondelete = $(".table tbody td a.delete_product");
    ondelete.click(function(){
        var product_id = $(this).attr("data-id")

        var request = {
            "url" : `https://onlineshop11.onrender.com/api/products/${product_id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })

///////////////////////////////////////////////////////////////////
/////////Add to Cart btn in user_show_all_products.ejs ////////////

$(".user_show_all_products_form").submit(function(event){
    event.preventDefault();
    
    var unindexed_array = $(this).serializeArray();
    var cartData = {};

    $.map(unindexed_array, function(n, i){
        cartData[n['name']] = n['value'];
    })


    var request = {
        "url" : 'https://onlineshop11.onrender.com/api/carts',
        "method" : "POST",
        "data" : cartData ///this is a PART of the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("item added Successfully!");
        location.reload();
    })
});
/////////////////////////////////////////////////////////////
//////////// save quantity in user_show_cart.ejs ////////////

$(".user_show_cart_form").submit(function(event){
    event.preventDefault();
    var unindexed_array = $(this).serializeArray();
    var cart = {};

    $.map(unindexed_array, function(n, i){
        cart[n['name']] = n['value'];
    })

    var request = {
        "url" : `https://onlineshop11.onrender.com/api/carts/${cart.id}`,
        "method" : "PUT",
        "data" : cart ///this is the body which is the form data
    }

    $.ajax(request).done(function(response){
        alert("Cart Updated Successfully!");
        location.reload();
    })
    
});
/////////////////////////////////////////////////////////////////////////
////////// delete a product from Cart btn in user_show_cart.ejs /////////  no change
$("a.user_show_cart_delete_product").click(function(event){
     event.preventDefault();      
        var cartId = $(this).attr("cart-id");
        var productId = $(this).attr("product-id")
        var request = {
            "url" : `https://onlineshop11.onrender.com/api/carts/delete_product/${cartId}/${productId}`, //req.params.cartId and req.params.productId
            "method" : "PUT",
            "data":""
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

});
//////////////////////////////////////////////////////////////////////
/////////////// delete Cart btn in user_show_cart.ejs //////////////// no change

    var ondelete = $(".user_show_cart_delete_cart");
    ondelete.click(function(){
        var id = $(this).attr("cart-id")

        var request = {
            "url" : `https://onlineshop11.onrender.com/api/carts/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })

//////////////////////////////////////////////////////////////////////////////
//////////////////// place order btn in user_show_order.ejs //////////////////

$(".user_show_order_form").submit(function(event){
    event.preventDefault();
    var cartId =$(".cartId").attr("value");

        var unindexed_array = $(this).serializeArray();
        var orderData = {};

        $.map(unindexed_array, function(n, i){
            orderData[n['name']] = n['value'];
        })

        if ($("#radio-1").is(':checked')){ ////// PaymentMethod = 'cashOnDelivery'
            //let PaymentMethod = 'cashOnDelivery';
            var request = {
                "url" : `https://onlineshop11.onrender.com/api/orders/`,
                "method" : "POST",
                "data" : orderData 
            }

            $.ajax(request).done(function(response){
                alert("item added Successfully!");
                
            })
            location.reload();
        }
        /////////////////// Strip ////////////////////////////////////////
        else if ($("#radio-2").is(':checked')){

            window.location.pathname = `/api/stripe/${orderData.cartId}`;
        }
       
});
//////////////////////////////////////////////////////////////////////////////
/////////////// delete btn in Admin_show_all_orders.ejs //////////////////////

    var ondelete = $(".table tbody td a.admin_show_all_orders_delete_order");
    ondelete.click(function(){
        var cart_id = $(this).attr("data-id")

        var request = {
            "url" : `https://onlineshop11.onrender.com/api/orders/delete/${cart_id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this order?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
