import React, { Component } from 'react';
import logo from "../../assets/images/logo.png";
import Cart from '../cart/Cart';

import { CartContext } from '../../context/CartContext.js';
import { GET_CATEGORIES } from "../../graphql/queries.js";
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],

        };
    }
    static contextType = CartContext;
    componentDidMount() {
        this.context.fetchCart();
        this.fetchCategories();
    }


    fetchCategories = async () => {
        try {

            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_CATEGORIES }),
            });

            const result = await response.json();

            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ categories: result.data.categories, loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch categories', loading: false });
        }
    };



    render() {
        const { categories, loading, error } = this.state;
        const { cart } = this.context;


        const { items, params } = this.props;
        if (loading) return <p>Loading categories...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <header>
                <nav className="navbar navbar-expand-lg ">
                    <div className="container">
                        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                            <ul className="m-0 d-flex align-items-center pt-3">
                                {categories.map((category) => (
                                    <li
                                        data-testid='category-link'
                                        className={params === category.name ? "nav-item active" : "nav-item"}
                                        key={category.name}
                                    >
                                        <a
                                            className="nav-link"
                                            aria-current="page"
                                            href={"/category/" + category.name}
                                            data-testid={params === category.name ? 'active-category-link' : 'category-link'}
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <a className="navbar-brand" href="/category/all">
                                    <img src={logo} alt='logo' />
                                </a>
                            </div>
                            <div className='shoppingCart'>

                                <Cart cartElements={cart} />

                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;