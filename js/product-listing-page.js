
//****************DOM Elements & Variable Declaration********************
var shoppingCartButton = document.querySelector(".shopping-cart-list");
var shoppingCartWrapper = document.querySelector(".shopping-cart-wrapper");
var productGrid = document.querySelector(".prod-grid-content");
var deleteLink = document.querySelector(".shopping-cart-item-action-links>span>a");
var cartList = document.querySelector('.shopping-cart-items');

// create cart array to hold Items.
var cart = [];

// Discount code variable
var discountCode;

//Cart Item constructor
var Item = function(name, description, price, quantity) {
  this.calcSubtotal = function () {
    return (this.quantity * this.price);
  };
  this.name = name;
  this.description = description;
  this.price = price;
  this.quantity = quantity;
  this.subtotal = this.calcSubtotal();
};

//*************************   Shopping Cart Functions *************************

//@TODO - fix the adding new cart item bug when quantity reaches >10
function addItemToCart(name, description, price, quantity) {
  var match = false;
  for (var i in cart) {
    if (cart[i].name === name && cart[i].quantity < 10) {
      cart[i].quantity += quantity;
      cart[i].subtotal = cart[i].calcSubtotal();
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


// function removeItemFromCart(name) {
//   for (var i in cart) {
//     if (cart[i].name === name) {
//       cart[i].quantity --;
//       if (cart[i].quantity <= 0) {
//         cart.splice(i, 1);
//       }
//       return;
//     }
//   }
//   saveCart();
// }


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
  for(var i in cart) {
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
    output +="<div class='shopping-cart-item-box'>" +
                "<div class='shopping-cart-item-image'><img src='http://placehold.it/100x100'></div>" +
                "<div class='shopping-cart-item-name'>" + cart[i].name + "</div>" +
                "<div class='shopping-cart-item-description'><span>" + cart[i].description + "</span></div>" +
                "<div class='shopping-cart-item-action-links'><span><a href='#'>Delete</a></span></div>" +
                "</div>" +
                "<div class='shopping-cart-item-price'>" + cart[i].price.toFixed(2) + "</div>" +
                "<div class='shopping-cart-item-quantity'><label for='cart-item-quantity-" + id + "'" + "></label>" +
                "<select name='cart-item-quantity-" + id + "'" +  "id='cart-item-quantity-" + id + "'" + ">" +
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
                "</select></div>";
  }

  //create the cart outer div and add the cart item output as the HTML
  var list = document.querySelector('.shopping-cart-items');
  var divNode = document.createElement("div");

  // delete all children before we build the new output
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }

  divNode.className = "shopping-cart-item clearfix";

  divNode.innerHTML = output;

  list.appendChild(divNode); // @TODO - clear the child divs first

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
      console.log("inside while: " + cartItem);
      cartItem = cartItem.parentNode;
    }

    //go back down to get the item name
    var cartItemName = cartItem.querySelector(".shopping-cart-item-name");
    removeItemFromCartAll(cartItemName.textContent.trim());
  }
});

//@TODO - Fix bug with this not working on items in cart > 0
cartList.addEventListener('change', function(event) {
  if (event.target.nodeName === "SELECT") {
    var eventElem = event.target;
    var cartItemName;
    var optionValue = Number(eventElem.value);


    while (!eventElem.classList.contains("shopping-cart-item")) {
      eventElem = eventElem.parentNode;
    }

    cartItemName = eventElem.querySelector(".shopping-cart-item-name").textContent.trim();

    for (var i in cart) {
      if (cart[i].name === cartItemName) {
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
//@TODO fix the toggle visibility issue when items in cart > 0
shoppingCartButton.addEventListener('click', function() {
  var cartElems = document.querySelector(".shopping-cart-items");
  shoppingCartWrapper.classList.toggle('toggle-visibility');
  if (cart.length === 0){
    cartElems.innerHTML = "<br /><h3>You have no items in your cart</h3>";
  } else {
    displayCart();
  }
});
