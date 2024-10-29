import React, { Component } from 'react';
import cartImage from "../../assets/images/shopping-cart.png";
import { CartContext } from '../../context/CartContext.js';
import slugify from 'react-slugify';

export default class Cart extends Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = {
            cartElements: this.props.cartElements || [],
        };
    }

    componentDidMount() {
        this.context.fetchCart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cartElements !== this.props.cartElements) {
            this.setState({
                cartElements: this.props.cartElements,
            });
        }

        if (prevProps.isCartOpen !== this.context.isCartOpen && this.context.isCartOpen) {
            const modalElement = document.getElementById("exampleModal");
            if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    }

    incrementQuantity = (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cartElements.map((item) => {
                if (item.id === cartItemId) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }
                return item;
            });
            return { cartElements: updatedCart };
        });
    };

    decrementQuantity = async (cartItemId) => {
        this.setState((prevState) => {
            const updatedCart = prevState.cartElements
                .map((item) => {
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
                })
                .filter((item) => item.quantity > 0);
            return { cartElements: updatedCart };
        });

        const cartItem = this.state.cartElements.find((item) => item.id === cartItemId);
        if (cartItem && cartItem.quantity === 1) {
            await this.removeFromCartMutation(cartItem.sku_id);
        }
    };

    removeFromCartMutation = async (sku_id) => {
        try {
            const response = await fetch(
                'https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                  mutation {
                    removeFromCart(sku_id: ${sku_id}) {
                      id
                    }
                  }
                `,
                    }),
                }
            );

            const result = await response.json();
            if (result.errors) {
                console.error("Error removing item from cart", result.errors);
            }
        } catch (error) {
            console.error("Network error while removing item from cart", error);
        }
    };

    calculateTotalPrice = (cartItem) => {
        return cartItem.quantity * cartItem.product.prices[0].amount;
    };

    calculateTotalCartPrice = () => {
        const { cartElements } = this.state;
        return cartElements
            .reduce((acc, cartItem) => acc + this.calculateTotalPrice(cartItem), 0)
            .toFixed(2);
    };

    placeOrder = async () => {
        const { cartElements } = this.state;
        if (cartElements.length === 0) return;

        const total_price = this.calculateTotalCartPrice();
        const cart_id = 1;

        try {
            const response = await fetch(
                'https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `mutation {
                    createOrder(cart_id: ${cart_id}, total_price: ${total_price}, status: "pending") {
                        id
                    }
                }`,
                    }),
                }
            );

            const result = await response.json();
            if (result.errors) {
                console.error("Error creating order", result.errors);
                return;
            }

            this.context.clearCart();
            this.setState({ cartElements: [] });
            console.log("Order created successfully:", result.data.createOrder.id);
        } catch (error) {
            console.error("Network error while creating order", error);
        }
    };

    render() {
        const { cartElements } = this.state;

        return (
            <div>
                <button
                    data-testid='cart-btn'
                    type="button"
                    className="btn position-relative"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.context.toggleCart(true)}
                >
                    {cartElements.length <= 0 ? "" : <span className="cartCount">{cartElements.length}</span>}
                    <img src={cartImage} alt="cart icon" />
                </button>
                {this.context.isCartOpen && (
                    <div className="modal fade show" style={{ display: 'block' }} data-testid="cart-overlay" data-bs-dismiss="modal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="cartHeading d-flex align-items-center">
                                        <h4>My Bag, </h4>
                                        <p className="m-0">{cartElements.length} {cartElements.length <= 1 ? "item" : "items"}</p>
                                    </div>
                                    <div className="cartItemsContainer my-2">
                                        {cartElements.length > 0 ? (
                                            cartElements.map((cartItem, attrItemIndex) => (
                                                <div className="cartItem w-100 d-flex" key={cartItem.id}>
                                                    <div className="w-50 cartItemContent">
                                                        <h5 className="itemName">{cartItem.product.name}</h5>
                                                        <p className="m-0 itemPrice" data-testid='cart-item-amount'>
                                                            {cartItem.product.prices[0].currency_symbol}
                                                            {this.calculateTotalPrice(cartItem).toFixed(2)}
                                                        </p>
                                                        <div className="productAttr">
                                                            {cartItem.product.attributes.map((attrItem, index) => {
                                                                let content;
                                                                switch (attrItem.name) {
                                                                    case "color":
                                                                        content = (
                                                                            <div className="productColors" data-testid={`cart-item-attribute-${slugify(attrItem.name)}`} key={index}>
                                                                                <p>{attrItem.name}:</p>
                                                                                <div className="d-flex align-items-center w-75 sizesContainer my-2">
                                                                                    {attrItem.items.map((item, index) => (
                                                                                        <label
                                                                                            className="containerBlock colorItem"
                                                                                            style={{ background: item.value }}
                                                                                            key={index}
                                                                                            data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(attrItem.name)}`}
                                                                                        >
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="color"
                                                                                                value={item.value}
                                                                                                checked={cartItem.color === item.value}
                                                                                                data-testid={cartItem.color === item.value ? `cart-item-attribute-${slugify(attrItem.name)}-${item.display_value} cart-item-attribute-${slugify(attrItem.name)}-${item.display_value}-selected` : `cart-item-attribute-${slugify(attrItem.name)}-${item.display_value} cart-item-attribute-${slugify(attrItem.name)}-${item.display_value}`}
                                                                                            />
                                                                                            <span className="checkmark"></span>
                                                                                        </label>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                        break;
                                                                    case "capacity":
                                                                        content = (
                                                                            <div className="productSizes  my-2" data-testid={`cart-item-attribute-${slugify(attrItem.name)}`} key={index}>
                                                                                <p>{attrItem.name}:</p>
                                                                                {attrItem.items.map((item, index) => (
                                                                                    <label
                                                                                        className="containerBlock my-1"
                                                                                        key={index}
                                                                                        data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(attrItem.name)}`}
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="capacity"
                                                                                            value={item.display_value}
                                                                                            checked={cartItem.capacity === item.display_value}
                                                                                            data-testid={cartItem.capacity === item.value ? `cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)} cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}-selected` : `cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}`}
                                                                                        />
                                                                                        <span className="checkmark">{item.display_value}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                        break;
                                                                    case "size":
                                                                        content = (
                                                                            <div className="productSizes my-2" data-testid={`cart-item-attribute-${slugify(attrItem.name)}`} key={index}>
                                                                                <p>{attrItem.name}:</p>
                                                                                {attrItem.items.map((item, index) => (
                                                                                    <label
                                                                                        className="containerBlock my-1"
                                                                                        key={index}
                                                                                        data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(attrItem.name)}`}
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`product[${attrItemIndex}]["size"]`}
                                                                                            value={item.display_value}
                                                                                            checked={cartItem.size === item.display_value}
                                                                                            data-testid={cartItem.size === item.value ? `cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)} cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}-selected` : `cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}`}
                                                                                        />
                                                                                        <span className="checkmark">{item.display_value}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                        break;
                                                                    default:
                                                                        content = null;
                                                                }
                                                                return content;
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="w-50 d-flex flex-column align-items-center">
                                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 my-3">
                                                            <button
                                                                className="rounded border-0 bg-transparent py-2 px-3"
                                                                onClick={() => this.incrementQuantity(cartItem.id)}
                                                                data-testid="cart-item-increment-quantity-btn"
                                                            >
                                                                +
                                                            </button>
                                                            <p className="m-0 py-2 cartCount">{cartItem.quantity}</p>
                                                            <button
                                                                className="rounded border-0 bg-transparent py-2 px-3"
                                                                onClick={() => this.decrementQuantity(cartItem.id)}
                                                                data-testid="cart-item-decrement-quantity-btn"
                                                            >
                                                                -
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="emptyCart mt-3">Your Cart is Empty</p>
                                        )}
                                    </div>
                                    <div className="cartTotalContainer d-flex align-items-center justify-content-between">
                                        <h5>Total</h5>
                                        <p data-testid="total-price">{this.calculateTotalCartPrice()}</p>
                                    </div>
                                    <button className="primaryBtn w-100 mt-3" data-testid="place-order-btn" onClick={this.placeOrder}>Place Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
