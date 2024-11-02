import React, { Component } from 'react';
import ProductBox from '../../components/product/ProductBox';
import { GET_ALL_PRODUCT_WITH_CATEGORIES } from '../../graphql/queries.js';
import slugify from 'react-slugify';
import { NavigationContext } from '../../context/NavigationProvider.js';
import { API_BASE_URL } from "../../variables.js";

class CategoryPage extends Component {
    static contextType = NavigationContext;

    state = {
        products: [],
        loading: true,
        error: null,
        categoryName: null, // اجعل categoryName متغير في الحالة
    };

    componentDidMount() {
        this.fetchProducts(); // جلب المنتجات عند تحميل المكون
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedParam } = this.context;

        if (prevState.categoryName !== selectedParam) {
            this.setState({ categoryName: selectedParam }, this.fetchProducts);
        }
    }

    fetchProducts = async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        // إذا لم يكن هناك categoryName، اجلب جميع المنتجات
        let filteredProducts = !categoryName || categoryName === 'all'
            ? products
            : products.filter(product => product.category.name.toLowerCase() === categoryName.toLowerCase());

        return (
            <div className='categoryPage'>
                <div className='container py-5'>
                    <h2>{categoryName ? `${categoryName}` : 'all'}</h2>

                    <div className='row'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div className='col-12 col-lg-4' key={product.id} data-testid={`product-${slugify(product.name)}`}>
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
