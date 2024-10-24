import React, { createContext, Component } from 'react';
import { GET_CART, CLEAR_CART_MUTATION } from "../graphql/queries";
export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cart: [],
        loading: true,
        error: null,
    };


    fetchCart = async () => {

        try {
            const response = await fetch('https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/', {
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
            const response = await fetch('https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: ADD_TO_CART_MUTATION,
                    variables: {
                        skuId: skuId,
                        size: size || null,
                        color: color || null,
                        capacity: capacity || null
                    },
                }),
            });

            const result = await response.json();
            if (result.errors) {
                console.error('Error adding item to cart:', result.errors);
            } else {
                this.fetchCart();
            }
        } catch (err) {
            console.error('Failed to add item to cart:', err);
        }
    };

    clearCart = async () => {
        try {
            const response = await fetch('https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/', {
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

                this.setState({ cart: [] }, () => {
                    console.log('Cart cleared:', this.state.cart);
                });
            }
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cart: this.state.cart,
                    loading: this.state.loading,
                    error: this.state.error,
                    fetchCart: this.fetchCart,
                    addToCart: this.addToCart,
                    clearCart: this.clearCart
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }
}
