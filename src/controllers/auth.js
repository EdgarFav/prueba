import express from 'express'
import { random, authentication } from '../helpers/index.js'
import { getUserByEmail, createUser } from '../models/users.js'

export const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' }) //Comprobamos que el usuario envie los campos requeridos
    }
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists whit this email' })
    }

    try {
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                password: authentication(salt, password),
                salt
            }
        })
        return res.status(201).json(user)

    } catch (error) {
        console.log(error)
        return res.status(400).json(error.message)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password !== expectedHash) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('access-token', user.authentication.sessionToken, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

export const logout = async (req, res) => {
    res.clearCookie('access-token')
    return res.status(200).json({ message: 'Logged out' })
}