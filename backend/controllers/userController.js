import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = createToken(user._id)
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: 'Login failed' })
    }
}

const registerUser = async (req, res) => {
    const { name, password, email } = req.body
    try {
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: 'User already exists' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter at least 8 characters' })
        }

        //hasing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,

        })

        const user = await newUser.save()
        const token = createToken(user._id)
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: 'Registration failed' })
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

export { loginUser, registerUser }