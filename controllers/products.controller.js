import Product from "../models/Product.js";

const get = async (req, res) => {
    // filtros

    try {
        let query = `
            select 
            id as productId,
            name,
            price
            from products
        `;

        const params = [];

        const [productsData] = await Product.get(query, params);

        const products = productsData.map(({productId, name, price}) => ({
            id: productId,
            name,
            price
        }));

        console.log(products);

        res.json({products});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'error del servidor'});
    }
}

export default {
    get
}