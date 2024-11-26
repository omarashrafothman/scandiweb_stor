// queries.js
export const GET_CATEGORIES = `
    query GetCategories {
        categories {
            name
        }
    }
`;

export const GET_ALL_PRODUCT_WITH_CATEGORIES = `
                query GetAllProductsWithCategories {
                    products {
                        id
                        name
                        in_stock
                        galleries {
                            image_url
                        }
                        description
                        category {
                            id
                            name
                        }
                        sku_id
                        prices {
                            amount
                            currency_label
                            currency_symbol
                        }
                        attributes{
                        name
                        id
                        items{
                        id
                        value
                        }
                      }
                    }
                }
            `;



export const GET_CART = `
    query GetCart {
        cart(id: 1) {
            id
            cartItems {
                id
                cart_id
                sku_id
                quantity
                price
                 size
                 color
                 capacity
                product {
                    id
                    name
                    prices {
                        amount
                        currency_symbol
                    }
                    attributes {
                        name
                        items {
                            attribute_id
                            display_value
                            value
                        }
                    }
                    galleries {
                        image_url
                    }
                }
            }
        }
    }
`;
export const CLEAR_CART_MUTATION = `
        mutation {
            clearCart
        }
    `;
