import { commysql } from "../bd.js";

// Obtener todos los detalles de pedidos
export const getPedidosDetalle = async (req, res) => {
    try {
        const [result] = await commysql.query("SELECT * FROM pedidos_detalle");
        res.json({ cant: result.length, data: result });
    } catch (error) {
        return res.status(500).json({
            message: "Error al consultar detalles de pedidos"
        });
    }
};

// Obtener detalle por ID
export const getPedidoDetalleById = async (req, res) => {
    try {
        const [result] = await commysql.query("SELECT * FROM pedidos_detalle WHERE det_id = ?", [req.params.id]);
        if (result.length <= 0) {
            return res.status(400).json({
                det_id: 0,
                message: "Detalle no encontrado"
            });
        }
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Error al consultar detalle"
        });
    }
};

// Insertar nuevo detalle de pedido
export const postPedidoDetalle = async (req, res) => {
    try {
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body;

        const [result] = await commysql.query(
            "INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)",
            [prod_id, ped_id, det_cantidad, det_precio]
        );

        res.json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({
            message: "Error al insertar detalle"
        });
    }
};

// Actualización completa (PUT)
export const putPedidoDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body;

        const [result] = await commysql.query(
            "UPDATE pedidos_detalle SET prod_id=?, ped_id=?, det_cantidad=?, det_precio=? WHERE det_id=?",
            [prod_id, ped_id, det_cantidad, det_precio, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(400).json({
                message: "Detalle no encontrado para actualizar"
            });
        }

        const [row] = await commysql.query("SELECT * FROM pedidos_detalle WHERE det_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar detalle"
        });
    }
};

// Actualización parcial (PATCH)
export const patchPedidoDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body;

        const [result] = await commysql.query(
            `UPDATE pedidos_detalle SET 
                prod_id = IFNULL(?, prod_id),
                ped_id = IFNULL(?, ped_id),
                det_cantidad = IFNULL(?, det_cantidad),
                det_precio = IFNULL(?, det_precio)
            WHERE det_id = ?`,
            [prod_id, ped_id, det_cantidad, det_precio, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(400).json({
                message: "Detalle no encontrado para actualizar"
            });
        }

        const [row] = await commysql.query("SELECT * FROM pedidos_detalle WHERE det_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar parcialmente"
        });
    }
};

// Eliminar detalle de pedido
export const deletePedidoDetalleById = async (req, res) => {
    try {
        const [result] = await commysql.query("DELETE FROM pedidos_detalle WHERE det_id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Detalle no encontrado"
            });
        }

        res.json({ message: "Detalle eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar detalle"
        });
    }
};
