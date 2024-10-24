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

            const response = await fetch('https://4733-197-60-28-143.ngrok-free.app/php_projects/scandiweb_store/backend/', {
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
        // if (loading) return <p>Loading categories...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <header>
                <nav className="navbar navbar-expand-lg ">
                    <div className="container">
                        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                            <ul className="m-0 d-flex align-items-center pt-3">

                                {/*           {categories.map((category) => (
                                    <li

                                        className={params === category.name ? "nav-item active" : "nav-item"}
                                        key={category.name}
                                    >
                                        <a
                                            className="nav-link"
                                            href={"/home/" + category.name}
                                            data-testid={params === category.name ? 'active-category-link category-link' : 'category-link'}
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                ))}*/}


                                <li className={params === 'all' ? "nav-item active" : "nav-item"}>

                                    <a
                                        className="nav-link"
                                        href={"/home/all"}
                                        data-testid={params === 'all' ? 'active-category-link category-link' : 'category-link'}
                                    >
                                        all
                                    </a>

                                </li>
                                <li className={params === 'clothes' ? "nav-item active" : "nav-item"}>

                                    <a
                                        className="nav-link"
                                        href={"/home/clothes"}
                                        data-testid={params === 'clothes' ? 'active-category-link category-link' : 'category-link'}
                                    >
                                        clothes
                                    </a>

                                </li>
                                <li className={params === 'tech' ? "nav-item active" : "nav-item"}>

                                    <a
                                        className="nav-link"
                                        href={"/home/tech"}
                                        data-testid={params === 'tech' ? 'active-category-link category-link' : 'category-link'}
                                    >
                                        tech
                                    </a>

                                </li>
                            </ul>
                            <div>
                                <a className="navbar-brand" href="/">
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