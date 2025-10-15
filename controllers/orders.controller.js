import pool from "../db/pool.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const create = async (req, res) => {
    // obtener datos

    const {orderItems, userId} = req.body; // falta obtener el id del usuario.

    if (!orderItems || !userId) {
        return res.status(400).json({ error: "Faltan datos en la petición" });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const order = new Order({userId: userId, createdAt: new Date()});

        await order.insert(connection);

        const formattedOrderItems = await Promise.all(orderItems.map(async item => {
            const orderItem = await OrderItem.create({
                orderId: order.orderId,
                productId: item.productId,
                quantity: item.quantity
            });

            await orderItem.insert(connection);

            console.log(orderItem)

            order.total += orderItem.subtotal;

            return orderItem;
        }));

        await order.update(connection);

        // let orderText = `
        // Nueva orden de pedido:
        // ID de la orden: ${order.orderId}
        // ID del usuario: ${order.userId}
        // Fecha y hora: ${order.createdAt}
        // Total: ${order.total}
        // Productos: 
        // ${formattedOrderItems.map((item, index) => {
        //     return `${index + 1}. ${item.product.name} - Cantidad: ${item.quantity} - Subtotal: ${item.quantity * item.product.price}`;
        // })}
        // `;

        // await sendMail(orderText);

        // console.log('email enviado')

        await connection.commit();

        res.status(200).json({message: 'Orden creada con exito'});
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({error: 'error del servidor'});
    } finally {
        connection.release();
    }
}

const get = async (req, res) => {
    
    const {userId} = req.query;

    if (!userId) {
        return res.status(400).json({ error: "Faltan datos en la petición" });
    } 

    let query = `
        select
            id as orderId,
            user_id as userId,
            created_at as createdAt,
            total
        from orders
        where user_id = ?
    `;
    let params = [userId];

    try {
        const orders = await Order.get(query, params);

        console.log(orders)

        const ordersData = orders.map(({orderId, userId, createdAt, total, orderItems}) => ({
            id: orderId,
            userId, 
            createdAt,
            total,
            items: orderItems.map(({product, quantity}) => ({
                product: {
                    id: product.productId,
                    name: product.name,
                    price: product.price
                },
                quantity
            }))
        }));

        console.log(ordersData);

        res.status(200).json({orders: ordersData});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'error del servidor'});
    }
}

async function sendMail(text) {
  // Configuración SMTP (ejemplo con Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // mejor usa variables de entorno
    },
  });

  // Opciones del correo
  const mailOptions = {
    from: '"Mi App <arthureli81@gmail.com>"',
    to: "arthureli81@gmail.com",
    subject: 'Orden de pedido',
    text: text,
  };

  // Enviar
    return transporter.sendMail(mailOptions);
}


export default {
    create,
    get
}