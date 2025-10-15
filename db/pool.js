import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    database: 'ordersApp',
    port: 3306,
    user: 'root',
    password: '123456'
});

export default pool;