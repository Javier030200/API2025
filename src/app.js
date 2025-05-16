import express from 'express'
import cors from 'cors'
//para subir imagenes 
import path from 'path'
import { fileURLToPath } from 'url'


//importar las rutas:
import clientesRoutes from './Routes/clientesroutes.js'
import productosRoutes from './Routes/productosRoute.js'
import usuariosRoute from './Routes/usuariosRoute.js'
import pedidosRouter from './Routes/pedidos_route.js'
import detallespedidosRouter from './Routes/detallespedidos_route.js'


//definir los modulos de entrada 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//define los permisos
const corsOptions = {
    origin: '*', //la direccion del dominio
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json()); //interpreta objetos json
app.use(express.urlencoded({ extended: true }))//se añade para receptar formularios
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


//indicar que rutas se utiliza
app.use('/api', clientesRoutes)
app.use('/api', productosRoutes)
app.use('/api', usuariosRoute)
app.use('/api', pedidosRouter)
app.use('/api', detallespedidosRouter)
app.use((req, resp, next) => {
    resp.status(400).json({
        message: 'PAGINA NO ENCONTRADA'
    })
})
export default app;