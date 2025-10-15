import User from "../models/User.js";

const login = async (req, res) => {
    // obtener datos 

    const {email, password} = req.body;

    // ver si hay usuario existente con ese email

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({error: 'no hay un usuario con tal email'})
        }

        if (password !== user.password) {
            return res.status(404).json({error: 'contrasenia incorrecta'})
        }

        const jsonedUser = {
            id: user.userId,
            name: user.name,
            email: user.email,
            password: user.password
        }

        res.json({user: jsonedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'error interno del server'});
    }

}

const register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({error: 'ya existe un usuario con ese email'});
        }
        const newUser = new User({name, email, password});
        await newUser.insert();
        res.status(201).json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'error interno del server'});
    }
}

export default {
    login,
    register
}