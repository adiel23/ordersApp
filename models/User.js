import pool from "../db/pool.js";

class User {
    constructor({userId, name, email, password}) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static async findByEmail(email) {
        const [results] = await pool.query(`
            select
            id as userId,
            name,
            email,
            password
            from users
            where email = ?
            `, [email]);

        if (results.length > 0) {
            return new User(results[0]);
        }

        return null;
    }

    static async getById(userId) {  
        const [results] = await pool.query(`
            select
            id as userId,
            name,   
            email,
            password
            from users
            where id = ?
        `, [userId]);
        
        if (results.length > 0) {
            return new User(results[0]);
        }
        return null;
    }

    async insert() {
        const [result] = await pool.query(`
            insert into users (name, email, password)
            values (?, ?, ?)
        `, [this.name, this.email, this.password]);
        
        this.userId = result.insertId;
        return this;
    }
}

export default User;