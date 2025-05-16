import express from 'express';
import {
    getPedidos,
    getPedidoById,
    postPedido,
    putPedido,
    patchPedido,
    deletePedidoById
} from '../Controladores/pedidosCtrl.js';
// 
const router = express();

router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.post('/pedidos', postPedido);
router.put('/pedidos/:id', putPedido);
router.patch('/pedidos/:id', patchPedido);
router.delete('/pedidos/:id', deletePedidoById);

export default router;
