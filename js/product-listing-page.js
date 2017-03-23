(function(window) {
    //****************DOM Elements & Variable Declaration********************
    var shoppingCartButton = document.querySelector(".shopping-cart-list");
    var shoppingCartWrapper = document.querySelector(".shopping-cart-wrapper");
    var productGrid = document.querySelector(".prod-grid-content");
    var deleteLink = document.querySelector(".shopping-cart-item-action-links>span>a");
    var cartList = document.querySelector('.shopping-cart-items');
    var cartCoupon = document.querySelector('.shopping-cart-coupon');

    // create cart array to hold Items.
    var cart = [];

    //Cart Item constructor
    var Item = function(name, description, price, quantity) {
        this.calcSubtotal = function() {
            return (this.quantity * this.price);
        };
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = this.calcSubtotal();
    };

    //*************************   Shopping Cart Functions *************************

    //Add an Item to the cart array or, if exists, add to quantity
    function addItemToCart(name, description, price, quantity) {
        var match = false;
        for (var i in cart) {
            if (cart[i].name === name) {
                if (cart[i].quantity < 10) {
                    cart[i].quantity += quantity;
                    cart[i].subtotal = cart[i].calcSubtotal();
                }
                match = true;
            }
        }

        if (!match) {
            var item = new Item(name, description, price, quantity);
            cart.push(item);
        }

        saveCart();
        displayCart();
        return;
    }


    function removeItemFromCartAll(name) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart.splice(i, 1);
                saveCart();
                displayCart();
                break;
            }
        }
        return;
    }


    function clearCart() {
        cart = [];
    }


    function totalCart() {
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].subtotal;
        }
        return totalCost;
    }


    function saveCart() {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }


    function loadCart() {
        cart = JSON.parse(localStorage.getItem("shoppingCart"));
    }

    //display cart
    function displayCart() {
        var output = "";
        for (var i in cart) {
            var id = Number(i) + 1;
            output += "<div class='flexy-grid'>" +
                "<div class='flexy-10 shopping-cart-item-box'>" +
                "<div class='shopping-cart-item-image'><img src='http://placehold.it/100x100'></div>" +
                "<div class='shopping-cart-item-name'>" + cart[i].name + "</div>" +
                "<div class='shopping-cart-item-description'><span>" + cart[i].description + "</span></div>" +
                "<div class='shopping-cart-item-action-links'><span><a href='#'>Delete</a></span></div>" +
                "</div>" +
                "<div class='flexy-1 shopping-cart-item-price'>" + cart[i].price.toFixed(2) + "</div>" +
                "<div class='flexy-1 shopping-cart-item-quantity'><label for='cart-item-quantity-" + id + "'" + "></label>" +
                "<select name='cart-item-quantity-" + id + "'" + "id='cart-item-quantity-" + id + "'" + ">" +
                "<option value='1'>1</option>" +
                "<option value='2'>2</option>" +
                "<option value='3'>3</option>" +
                "<option value='4'>4</option>" +
                "<option value='5'>5</option>" +
                "<option value='6'>6</option>" +
                "<option value='7'>7</option>" +
                "<option value='8'>8</option>" +
                "<option value='9'>9</option>" +
                "<option value='10'>10</option>" +
                "</select></div></div>";
        }

        //create the cart outer div and add the cart item output as the HTML
        var list = document.querySelector('.shopping-cart-items');
        var divNode = document.createElement("div");

        // delete all children before we build the new output
        while (list.hasChildNodes()) {
            list.removeChild(list.lastChild);
        }

        divNode.className = "shopping-cart-item";

        divNode.innerHTML = output;

        list.appendChild(divNode);

        //----------set select option to quantity in our cart array -------
        var selectors = list.querySelectorAll(".shopping-cart-item-quantity select");

        for (var j in cart) {
            selectors[j].selectedIndex = cart[j].quantity - 1;
        }

        //set the subtotal html to the cart subtotal
        var cartSubtotal = document.querySelector("#shopping-cart-subtotal");
        cartSubtotal.innerHTML = "$" + totalCart().toFixed(2);

        shoppingCartWrapper.classList.remove('toggle-visibility');
    }


    //********************EVENT LISTENERS***************************************
    productGrid.addEventListener('click', function(event) {
        if (event.target.nodeName == "BUTTON") {
            var productInfo = event.target.parentNode;
            var productName = productInfo.querySelector(".prod-grid-item-info-main").textContent.trim();
            var productDesc = productInfo.querySelector(".prod-grid-item-info-description").textContent.trim();
            var productPrice = Number(productInfo.querySelector(".prod-grid-item-info-price").textContent.trim().slice(1));
            var productQuantity = 1;

            addItemToCart(productName, productDesc, productPrice, productQuantity);

        }
    });

    shoppingCartWrapper.addEventListener('click', function(event) {
        if (event.target.nodeName == "A") {
            var cartItem = event.target.parentNode; // set eventParent to event target parent before traversal

            //traverse the event target upwards
            while (!cartItem.classList.contains("shopping-cart-item-box")) {
                cartItem = cartItem.parentNode;
            }

            //go back down to get the item name
            var cartItemName = cartItem.querySelector(".shopping-cart-item-name");
            removeItemFromCartAll(cartItemName.textContent.trim());
        }
    });

    cartList.addEventListener('change', function(event) {
        if (event.target.nodeName === "SELECT") {
            var eventElem = event.target;
            var optionValue = Number(eventElem.value);
            var itemName = eventElem.parentNode;

            while (!itemName.classList.contains("shopping-cart-item-box")) {
                itemName = itemName.previousElementSibling;
            }

            itemName = itemName.querySelector(".shopping-cart-item-name").textContent.trim();


            for (var i in cart) {
                if (cart[i].name === itemName) {
                    cart[i].quantity = optionValue;
                    cart[i].subtotal = cart[i].calcSubtotal();
                }
            }
            saveCart();
            totalCart();
            displayCart();
        }
    });

    // Toggle shopping cart event listener
    shoppingCartButton.addEventListener('click', function() {
        var cartElems = document.querySelector(".shopping-cart-items");
        shoppingCartWrapper.classList.toggle('toggle-visibility');
        if (cart.length === 0) {
            cartElems.innerHTML = "<br /><h3>You have no items in your cart</h3>";
        }
    });


    cartCoupon.addEventListener('click', function(event) {
        function clearCouponCode() {
            cartCouponInput.value = "";
        }

        function isDiscountedSubtotalLower(current, discounted) {
            return (Number(discounted) < Number(current)) ? true : false;
        }


        if (event.target.nodeName === "BUTTON") {
            event.preventDefault();
            var cartSubtotal = document.querySelector("#shopping-cart-subtotal");
            var cartCouponInput = document.querySelector('#coupon-code');
            var couponCode = cartCouponInput.value.trim();
            var currentSubtotal = cartSubtotal.value.slice(1);
            var discountSubtotal;

            switch (couponCode) {
                case "10off":
                    discountSubtotal = (totalCart() * 0.9).toFixed(2);
                    if (isDiscountedSubtotalLower(currentSubtotal, discountSubtotal)) {
                        cartSubtotal.innerHTML = "$" + discountSubtotal;
                    } else {
                        alert("Your current subtotal is cheaper! Ignoring your discount code.");
                        clearCouponCode();
                    }
                    break;
                case "20off":
                    discountSubtotal = (totalCart() * 0.8).toFixed(2);
                    if (isDiscountedSubtotalLower(currentSubtotal, discountSubtotal)) {
                        cartSubtotal.innerHTML = "$" + discountSubtotal;
                    } else {
                        alert("Your current subtotal is cheaper! Ignoring your discount code.");
                        clearCouponCode();
                    }
                    break;
                case "50off":
                    discountSubtotal = (totalCart() * 0.5).toFixed(2);
                    if (isDiscountedSubtotalLower(currentSubtotal, discountSubtotal)) {
                        cartSubtotal.innerHTML = "$" + discountSubtotal;
                    } else {
                        alert("Your current subtotal is cheaper! Ignoring your discount code.");
                        clearCouponCode();
                    }
                    break;
                default:
                    alert("Wrong coupon code! Try 10off, 20off or 50off");
                    clearCouponCode();
            }
        }
    });
    window.cart = cart; //expose to global

})(window);
