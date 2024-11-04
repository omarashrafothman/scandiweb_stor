import React, { Component } from 'react';

import { CartContext } from '../../context/CartContext.js';
import slugify from 'react-slugify';
import { API_BASE_URL } from "../../variables.js";
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
    }




    calculateTotalPrice = (cartItem) => {
        return cartItem.quantity * cartItem.product.prices[0].amount;
    };

    calculateTotalCartPrice = () => {
        const { cartElements } = this.state;
        return cartElements.reduce(
            (acc, cartItem) => acc + this.calculateTotalPrice(cartItem),
            0
        ).toFixed(2);
    };

    placeOrder = async () => {
        const { cartElements } = this.state;
        if (cartElements.length === 0) return;

        const total_price = this.calculateTotalCartPrice();
        const cart_id = 1;

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation { createOrder(cart_id: ${cart_id}, total_price: ${total_price}, status: "pending") { id } }`,
                }),
            });
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

    closeModal = () => {
        this.context.toggleCart(false);
    };
    // handleParentClose = (e) => {
    //     console.log(e.target.id)
    //     if (e.target.id !== "exampleModal") {
    //         return
    //     } else { this.closeModal(); }


    // }

    render() {
        const { cartElements } = this.state;
        const { isCartOpen } = this.context;
        const { cart } = this.context;
        console.log(cart)


        return (
            <div>


                {isCartOpen && (
                    <div
                        data-testid="cart-overlay"
                        className={isCartOpen ? "modal fade show " : "modal fade "}

                        id="exampleModal"
                        tabIndex="-1"
                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={(e) => {
                            if (e.target.id === "exampleModal") {
                                this.closeModal();
                            }
                        }}


                    >

                        <div className="modal-dialog" >
                            <div className="modal-content" >

                                <div className="modal-body" id='modalBody' onClick={this.handleParentClose}>
                                    <div className="cartHeading d-flex align-items-center">
                                        <h4>My Bag,</h4>
                                        <p className="m-0">{cartElements.length} {cartElements.length <= 1 ? "Item" : "Items"}</p>
                                    </div>

                                    <div className="cartItemsContainer my-2">
                                        {cartElements.length > 0 ? (
                                            cartElements.map((cartItem, attrItemIndex) => (
                                                <div className="cartItem w-100 d-flex" key={cartItem.id}>
                                                    <div className="w-50 cartItemContent">
                                                        <h5 className="itemName">{cartItem.product.name}</h5>
                                                        <p className="m-0 itemPrice" data-testid="cart-item-amount">
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
                                                                                            data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}`}
                                                                                        >
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="color"
                                                                                                value={item.value}
                                                                                                checked={cartItem.color === item.value}
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
                                                                            <div className="productSizes my-2" data-testid={`cart-item-attribute-${slugify(attrItem.name)}`} key={index}>
                                                                                <p>{attrItem.name}:</p>
                                                                                {attrItem.items.map((item, index) => (
                                                                                    <label
                                                                                        className="containerBlock my-1"
                                                                                        key={index}
                                                                                        data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}`}
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="capacity"
                                                                                            value={item.display_value}
                                                                                            checked={cartItem.capacity === item.display_value}
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
                                                                                        data-testid={`cart-item-attribute-${slugify(attrItem.name)}-${slugify(item.display_value)}`}
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="size"
                                                                                            value={item.display_value}
                                                                                            checked={cartItem.size === item.value}
                                                                                        />
                                                                                        <span className="checkmark">{item.display_value}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                        break;
                                                                    default:
                                                                        content = null;
                                                                        break;
                                                                }
                                                                return content;
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="w-50 d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center justify-content-between flex-column cartItemquantity">
                                                            <button
                                                                data-testid="cart-item-amount-increase"
                                                                className="d-flex align-items-center justify-content-center"
                                                                onClick={() => this.context.incrementQuantity(cartItem.id)}
                                                            >
                                                                +
                                                            </button>
                                                            <span>{cartItem.quantity}</span>
                                                            <button
                                                                data-testid="cart-item-amount-decrease"
                                                                className="d-flex align-items-center justify-content-center"
                                                                onClick={() => this.context.decrementQuantity(cartItem.id)}
                                                            >
                                                                -
                                                            </button>
                                                        </div>

                                                        <div className="itemImage">
                                                            <img
                                                                src={cartItem.product.galleries[0].image_url}
                                                                alt="product image"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Your cart is empty.</p>
                                        )}
                                    </div>

                                    {cartElements.length > 0 && (
                                        <div className="d-flex flex-column align-items-center w-100 cartTotal">
                                            <div className="d-flex align-items-center justify-content-between w-100 cartTotalPrice">
                                                <p>Total</p>
                                                <span>{cartElements[0]?.product.prices[0].currency_symbol}{this.calculateTotalCartPrice()}</span>
                                            </div>

                                            <button
                                                type="button"
                                                className=" cartBtn w-100"

                                                onClick={this.placeOrder}
                                            >
                                                Place Order
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>


                    </div>
                )
                }
            </div>
        );
    }
}
