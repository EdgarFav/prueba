import crypto from 'crypto'
process.loadEnvFile('./.env')

const secret = process.env.SECRET

export const random = () => crypto.randomBytes(128).toString('base64')
export const authentication = (salt, password) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(secret).digest('hex')
}