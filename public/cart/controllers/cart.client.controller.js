/*
 * cart.client.controller.js
 * --------------------------
 * 
 * This file contains the front-end controller for the
 * cart. This includes methods such as updating and deleting
 * items from the cart.
 *
 */

// Invoke 'stict' Javascript mode
'use strict';

angular.module('cart')
       .controller('CartController', CartController);

CartController.$inject = ['$scope', '$routeParams', '$ngBootbox', 'Cart', 'CartService'];

function CartController($scope, $routeParams, $ngBootbox, Cart, CartService) {
    let vm = this;

    vm.cart = Cart;

    $scope.addToCart = function() {
        // Disable the form on submission
        $scope.disable = true;
        
        // Get the book ID
        let cart = new CartService({
            bookId: $routeParams.bookId
        });

        cart.$addToCart()
            .then(function(res) {
                // To show success message
                $scope.success = true;
                // Update the cart
                return cart.$readCart();
            })
            .then(function(res) {
                // Replace the controller's cart
                vm.cart = res.cart;
            })
            .catch(function(errorResponse) {
                $scope.success = false;
                console.error(errorResponse);
            })
            .finally(function() {
                // Re-enable the form
                $scope.disable = false;
            });
    };

    $scope.readCart = function() {
        // Intialize the User service
        let user = new CartService();
        
        // Fetch the cart information
        user.$readCart()
            .then(function(response) {
                // Retreive the display cart from the server
                let cart = response.cart;

                // Build the options for the display cart
                let dialogOptions = {
                    templateUrl: 'cart/views/cart.client.view.html',
                    title: '<div class="text-center">Cart</div>',
                    backdrop: true,
                    onEscape: true,
                    scope: $scope, // Not expliciltly stated in the ngBootbox docs, but allows ngBoobox to share Angular's scope
                    buttons: {
                        clear: {
                            label: 'Clear Cart',
                            callback: function() { 
                                return $scope.deleteCart();
                            }
                        },
                        confirm: {
                            label: 'Checkout',
                            callback: function() {
                                console.log('go to checkout');
                            }
                        }
                    }
                };

                // Open the cart modal
                $ngBootbox.customDialog(dialogOptions);
            });
    };

    $scope.deleteCart = function() {
        // Initialize the User service
        let cart = new CartService();

        // Delete items in the cart
        cart.$deleteCart()
            .then(function(res) {
                if (res.success)
                    return cart.$readCart();
            })
            // Update the cart
            .then(function(res) {
                // Fetch the cart and set it to the controller's cart
                vm.cart = res.cart;
            })
            .catch(function(err) {
                console.error('An error occurred.');
            });
    };
}