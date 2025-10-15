import express from 'express';

const app = express();

import orderRoutes from './routes/orders.routes.js';
import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';

app.use(express.json());

app.use(orderRoutes);
app.use(productRoutes);
app.use(authRoutes);

app.listen(3000, () => {
    console.log('escuchado en el puerto 3000');
});