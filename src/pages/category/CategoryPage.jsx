import React, { Component } from 'react';
import ProductBox from '../../components/product/ProductBox';
import { GET_ALL_PRODUCT_WITH_CATEGORIES } from '../../graphql/queries.js';

class CategoryPage extends Component {
    state = {
        categoryName: null,
        products: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        const categoryName = window.location.pathname.split('/')[2];
        this.setState({ categoryName }, this.fetchProducts);
    }

    fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost/php_projects/scandiweb_store/backend/index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: GET_ALL_PRODUCT_WITH_CATEGORIES }),
            });

            const result = await response.json();

            if (result.errors) {
                this.setState({ error: result.errors[0].message, loading: false });
            } else {
                this.setState({ products: result.data.products, loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to fetch products', loading: false });
        }
    };

    render() {
        const { categoryName, products, loading, error } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error}</p>;
        }

        let filteredProducts = categoryName === 'all'
            ? products
            : products.filter(product => product.category.name === categoryName);

        return (
            <div className='categoryPage'>
                <div className='container py-5'>
                    <h2>{categoryName ? `${categoryName}` : 'Loading...'}</h2>

                    <div className='row'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div className='col-12 col-lg-4' key={product.id}>
                                    <ProductBox
                                        name={product.name}
                                        image={product.galleries[0]?.image_url || 'default-image-url'}
                                        price={product.prices[0].amount}
                                        id={product.sku_id}
                                        stock={product.in_stock}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No products found in this category.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryPage;
