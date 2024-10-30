import React, { createContext, Component } from 'react';
import { GET_CART, CLEAR_CART_MUTATION } from "../graphql/queries";
import { API_BASE_URL } from "../variables"
export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cart: [],
        loading: true,
        error: null,
        isCartOpen: false, // New state variable to track cart visibility
    };

    fetchCart = async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CART }),
            });
            const result = await response.json();
            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ cart: result.data.cart.cartItems, loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch cart', loading: false });
        }
    };

    addToCart = async (skuId, color, size, capacity) => {
        // Wrap the string variables with double quotes to ensure proper GraphQL formatting
        const ADD_TO_CART_MUTATION = `
            mutation add {
                addToCart(sku_id: ${skuId}, color: "${color}", size: "${size}", capacity: "${capacity}") {
                    id
                }
            }
        `;
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: ADD_TO_CART_MUTATION }),
            });

            const result = await response.json();
            if (result.errors) {
                console.error('Error adding item to cart:', result.errors);
            } else {
                this.setState({ isCartOpen: true });
                this.fetchCart();
            }
        } catch (err) {
            console.error('Failed to add item to cart:', err);
        }
    };

    clearCart = async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: CLEAR_CART_MUTATION }),
            });
            const result = await response.json();

            if (result.errors) {
                console.error('Error clearing cart:', result.errors);
            } else {
                this.setState({ cart: [], isCartOpen: false }); // Clear cart and close it
                console.log('Cart cleared:', this.state.cart);
            }
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    toggleCart = () => {
        this.setState(prevState => ({ isCartOpen: !prevState.isCartOpen })); // Method to toggle cart visibility
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cart: this.state.cart,
                    loading: this.state.loading,
                    error: this.state.error,
                    isCartOpen: this.state.isCartOpen, // Provide the cart open state
                    fetchCart: this.fetchCart,
                    addToCart: this.addToCart,
                    clearCart: this.clearCart,
                    toggleCart: this.toggleCart, // Provide the toggle method
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }
}
