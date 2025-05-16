import express from "express";
import multer from 'multer'
import {
    getProductos,
    getProductoById,
    postProducto,
    putProducto,
    patchProducto,
    deleteProductoById
} from "../Controladores/productosCtrl.js";

const storage =multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads'); //carpeta donde se guardan las imagenes
    },
    filename: (req, file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploads=multer({storage});

const router = express.Router();

router.get('/productos', getProductos);
router.get('/productos/:id', getProductoById);
router.post('/productos',uploads.single('prod_imagen'), postProducto);
router.put('/productos/:id', uploads.single('prod_imagen'), putProducto);
router.patch('/productos/:id',uploads.single('prod_imagen'), patchProducto);
router.delete('/productos/:id', deleteProductoById);

export default router;
