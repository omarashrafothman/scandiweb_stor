import React, { Component } from 'react';
import logo from "../../assets/images/logo.png";
import Cart from '../cart/Cart';
import { CartContext } from '../../context/CartContext.js';
import { NavigationContext } from '../../context/NavigationProvider.js';
import { GET_CATEGORIES } from "../../graphql/queries.js";
import { API_BASE_URL } from "../../variables.js"
import cartImage from "../../assets/images/shopping-cart.png";
import { NavLink } from 'react-router-dom';

class Header extends Component {
    static contextType = CartContext;

    constructor(props) {
        super(props);
        this.state = { categories: [], error: null };
    }

    componentDidMount() {
        this.context.fetchCart();
        this.fetchCategories();
    }

    fetchCategories = async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: GET_CATEGORIES }),
            });
            const result = await response.json();
            if (result.errors) {
                this.setState({ error: result.errors[0].message });
            } else {
                this.setState({ categories: result.data.categories });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch categories' });
        }
    };

    handleLinkClick = (category, setSelectedParam) => (event) => {

        // const newPath = `/${category}`;
        // window.history.pushState({}, "", newPath);
        setSelectedParam(category);
    };



    render() {
        const { categories, error } = this.state;
        const { cart } = this.context;

        if (error) return <p>Error: {error}</p>;

        return (
            <NavigationContext.Consumer>
                {({ selectedParam, setSelectedParam }) => (

                    <header>
                        <nav className="navbar navbar-expand-lg">
                            <div className="container">
                                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                                    <ul className="m-0 d-flex align-items-center pt-3 justify-content-between">

                                        <li className={window.location.pathname === "/" ? "nav-item active" : "nav-item"}>
                                            <NavLink
                                                className="nav-link"
                                                to="/"
                                                onClick={this.handleLinkClick("", setSelectedParam)}
                                                data-testid={window.location.pathname === "/" ? 'active-category-link' : 'category-link'}
                                            >
                                                all
                                            </NavLink>
                                        </li>

                                        <li className={selectedParam === "clothes" ? "nav-item active" : "nav-item"}>
                                            <NavLink
                                                className="nav-link"
                                                to="/clothes"
                                                onClick={this.handleLinkClick("clothes", setSelectedParam)}

                                                data-testid={selectedParam === "clothes" ? 'active-category-link' : 'category-link'}                                            >
                                                clothes
                                            </NavLink>
                                        </li>

                                        <li className={selectedParam === "tech" ? "nav-item active" : "nav-item"}>
                                            <NavLink
                                                className="nav-link"
                                                to="/tech"
                                                onClick={this.handleLinkClick("tech", setSelectedParam)}

                                                data-testid={selectedParam === "tech" ? 'active-category-link' : 'category-link'}                                            >
                                                tech
                                            </NavLink>
                                        </li>





                                        {/*     {categories.map((category) => (
                                            <li
                                                className={selectedParam === category.name ? "nav-item active" : "nav-item"}
                                                key={category.name}
                                            >
                                                <a
                                                    className="nav-link"
                                                    href={"/" + category.name}
                                                    onClick={this.handleLinkClick(category, setSelectedParam)}
                                                    data-testid={selectedParam === category.name ? "active-category-link category-link" : "category-link"}

                                                >
                                                    {category.name}
                                                </a>
                                            </li>
                                        ))}*/}
                                    </ul>
                                    <div>
                                        <a className="navbar-brand" href="/">
                                            <img src={logo} alt="logo" />
                                        </a>
                                    </div>
                                    <div className="shoppingCart" >
                                        <button
                                            data-testid="cart-btn"
                                            type="button"
                                            className="btn position-relative"
                                            onClick={() => this.context.toggleCart(true)}
                                        >
                                            {this.context.cart.length <= 0 ? "" : <span className="cartCount">{this.context.cart.length}</span>}
                                            <img src={cartImage} alt="cart icon" />
                                        </button>
                                        <Cart cartElements={cart} />
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                )}
            </NavigationContext.Consumer>
        );
    }
}

export default Header;
