import React, { createContext, Component } from 'react';
import { GET_CART, CLEAR_CART_MUTATION, UPDATE_CART_QUANTITY_MUTATION } from "../graphql/queries";
import { API_BASE_URL } from "../variables";
export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cart: [],
        loading: true,
        error: null,
        isCartOpen: false,
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
                this.setState({ cart: [], isCartOpen: false });
            }
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    toggleCart = () => {
        this.setState(prevState => ({ isCartOpen: !prevState.isCartOpen }));
    };
    incrementQuantity = (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cart.map((item) => {
                if (item.id === cartItemId) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }
                return item;
            });
            return { cart: updatedCart };
        });
    };

    //     try {
    //         const response = await fetch(API_BASE_URL, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //             },
    //             body: JSON.stringify({ query: UPDATE_CART_QUANTITY_MUTATION(skuId, quantity) }),
    //         });

    //         const result = await response.json();
    //         if (result.errors) {
    //             console.error('Error updating cart quantity:', result.errors);
    //         } else {
    //             this.fetchCart();
    //         }
    //     } catch (err) {
    //         console.error('Failed to update cart quantity:', err);
    //     }
    // };
    decrementQuantity = async (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cart.map((item) => {
                if (item.id === cartItemId) {
                    const newQuantity = item.quantity - 1;
                    if (newQuantity >= 0) {
                        return {
                            ...item,
                            quantity: newQuantity,
                        };
                    }
                }
                return item;
            }).filter(item => item.quantity > 0);

            return { cart: updatedCart };
        });

        const cartItem = this.state.cart.find(item => item.id === cartItemId);
        if (cartItem && cartItem.quantity === 1) {
            await this.removeFromCartMutation(cartItem.sku_id);
        }

    };

    removeFromCartMutation = async (sku_id) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation { removeFromCart(sku_id: ${sku_id}) { id } }`,
                }),
            });
            const result = await response.json();
            if (result.errors) {
                console.error("Error removing item from cart", result.errors);
            }
        } catch (error) {
            console.error("Network error while removing item from cart", error);
        }
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cart: this.state.cart,
                    loading: this.state.loading,
                    error: this.state.error,
                    isCartOpen: this.state.isCartOpen,
                    fetchCart: this.fetchCart,
                    addToCart: this.addToCart,
                    clearCart: this.clearCart,
                    toggleCart: this.toggleCart,
                    decrementQuantity: this.decrementQuantity,
                    incrementQuantity: this.incrementQuantity,
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }
}
