var shoppingCartButton = document.querySelector(".shopping-cart-list");
var shoppingCartWrapper = document.querySelector(".shopping-cart-wrapper");
var productGrid = document.querySelector(".prod-grid-content");
var cartCounter = 0; //@TODO - this should be part of a closure

// Functions

function addToCart(event) {

  if (event.target.nodeName == "BUTTON") {
    cartCounter += 1;
    var productInfo = event.target.parentNode;
    var productName = productInfo.querySelector(".prod-grid-item-info-main").textContent.trim();
    var productDesc = productInfo.querySelector(".prod-grid-item-info-description").textContent.trim();
    var productPrice = productInfo.querySelector(".prod-grid-item-info-price").textContent.trim();

    var output = "<div class='shopping-cart-item clearfix'>" +
                "<div class='shopping-cart-item-box'>" +
                "<div class='shopping-cart-item-image'><img src='http://placehold.it/115x115'></div>" +
                "<div class='shopping-cart-item-name'>" + productName + "</div>" +
                "<div class='shopping-cart-item-description'><span>" + productDesc + "</span></div>" +
                "<div class='shopping-cart-item-action-links'><span><a href='#'>Delete</a></span></div>" +
                "</div>" +
                "<div class='shopping-cart-item-price'>" + productPrice + "</div>" +
                "<div class='shopping-cart-item-quantity'><label for='cart-item-quantity-" + cartCounter + "'" + "></label>" +
                "<select name='cart-item-quantity-" + cartCounter + "'" +  "id='cart-item-quantity-" + cartCounter + "'" + ">" +
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

    var list = document.querySelector('.shopping-cart-list-head');
    var divNode = document.createElement("div");

    divNode.innerHTML = output;

    list.appendChild(divNode);
  }
}


//EVENT LISTENERS
productGrid.addEventListener('click', addToCart );

// Toggle shopping cart event listener
shoppingCartButton.addEventListener('click', function(e) {
  shoppingCartWrapper.classList.toggle('toggle-visibility');
});
