import {config} from 'dotenv'
config()


export const BD_HOST = process.env.BD_HOST || 'localhost'
export const BD_DATABASE = process.env.BD_DATABASE || 'base2025'
export const BD_USER = process.env.BD_USER || 'root'
export const BD_PASSWORD = process.env.BD_PASSWORD || ''
export const BD_PORT = process.env.BD_PORT || 3306
export const PORT = process.env.PORT || 3000
export const JWT_SECRETO = process.env.JWT_SECRETO || 'secreto_super_seguro'