import express from "express";
import {
    getUsuarios,
    getUsuariosxid,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuarios,
    iniciarSesion
} from "../Controladores/usuariosCtrl.js";
import { verificarToken } from '../middleware/verificarToken.js'

const router = express.Router();
router.post('/usuarios/login', iniciarSesion);

router.get('/usuarios', verificarToken, getUsuarios);
router.get('/usuarios/:id', getUsuariosxid);
router.post('/usuarios', postUsuarios);
router.put('/usuarios/:id', putUsuarios);
router.patch('/usuarios/:id', patchUsuarios);
router.delete('/usuarios/:id', deleteUsuarios);

export default router;
