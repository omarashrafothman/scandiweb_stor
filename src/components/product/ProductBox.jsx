import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import shoppingCart from "../../assets/images/cart.png";
import { CartContext } from '../../context/CartContext.js';



export default class ProductBox extends Component {
    static contextType = CartContext;



    handleAddToCart = (skuId, color, size, capacity) => {
        this.context.addToCart(skuId, color, size, capacity);
    };

    render() {
        const { image, name, price, id, stock, attributes } = this.props;






        const getFirstAttribute = () => {
            let firstSize;
            let firstColor;
            let firstCapacity;
            attributes.map((item) => {

                if (item.name === "size") {
                    firstSize = item.items[0].value;

                } else if (item.name === "capacity") {
                    firstCapacity = item.items[0].value;

                } else {
                    firstColor = item.items[0].value;


                }
            })
            this.handleAddToCart(id, firstColor, firstSize, firstCapacity)
        }
        return (
            <div className='productBox' >
                {!stock ? "" : <button className='addToCart bo '
                    onClick={() => getFirstAttribute()}>
                    <img src={shoppingCart} alt='add to cart' />
                </button>}
                {!stock ? <span className='stockStatus'>
                    <p>OUT OF STOCK</p>
                </span> : ""}
                <div className='productImageBox'>
                    <NavLink to={`/product/${id}`}>
                        <img src={image} className='productImage' alt='product' />
                    </NavLink>
                </div>
                <p className='productName'>{name}</p>
                <p className='productPrice'>${price}</p>
            </div>
        );
    }
}
