import express from 'express';
import ordersController from '../controllers/orders.controller.js';

const router = express.Router();

router.post('/orders', ordersController.create);

router.get('/orders', ordersController.get);

export default router