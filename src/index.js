import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import taskRouter from './routes/task.js'

process.loadEnvFile('./.env')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())


const uri = process.env.MONGO_URI

mongoose
    .connect(uri ?? '')
    .then(() => console.log('MongoDB connection established...'))
    .catch((error) => console.error('MongoDB connection failed:', error.message))

const PORT = process.env.PORT ?? 8080
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de JyT App')
})

app.use('/', authRouter)
app.use('/', taskRouter)

export default app
