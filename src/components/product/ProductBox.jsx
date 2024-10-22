import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shoppingCart from "../../assets/images/cart.png";
import { CartContext } from '../../context/CartContext.js';
import slugify from 'react-slugify';

export default class ProductBox extends Component {
    static contextType = CartContext;

    handleAddToCart = (skuId) => {
        this.context.addToCart(skuId);
    };

    render() {
        const { image, name, price, id, stock } = this.props;
        const productName = slugify(name);

        return (
            <div className='productBox' data-testid={`product-${productName}`}>
                {stock ? "" : <Link className='addToCart bo ' to={"/product/" + id}> <img src={shoppingCart} alt='add to cart' /></Link>}
                {stock ? <span className='stockStatus'>
                    <p>OUT OF STOCK</p>
                </span> : ""}
                <div className='productImageBox'>
                    <Link to={"/product/" + id}>
                        <img src={image} className='productImage' alt='product' />
                    </Link>
                </div>
                <p className='productName'>{name}</p>
                <p className='productPrice'>${price}</p>
            </div>
        );
    }
}
