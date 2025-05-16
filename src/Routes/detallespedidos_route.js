import express from 'express';
import {
    getPedidosDetalle,
    getPedidoDetalleById,
    postPedidoDetalle,
    putPedidoDetalle,
    patchPedidoDetalle,
    deletePedidoDetalleById
} from '../Controladores/detallespedidosCtrl.js';

const router = express();

router.get('/pedidosdetalle', getPedidosDetalle);
router.get('/pedidosdetalle/:id', getPedidoDetalleById);
router.post('/pedidosdetalle', postPedidoDetalle);
router.put('/pedidosdetalle/:id', putPedidoDetalle);
router.patch('/pedidosdetalle/:id', patchPedidoDetalle);
router.delete('/pedidosdetalle/:id', deletePedidoDetalleById);

export default router;
