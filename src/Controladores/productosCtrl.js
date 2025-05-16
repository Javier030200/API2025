import { commysql } from "../bd.js";

// Obtener lista de productos
export const getProductos = async (req, res) => {
    try {
        const [result] = await commysql.query("SELECT * FROM productos");
        res.json({ cant: result.length, data: result });
    } catch (error) {
        return res.status(500).json({
            message: "Error al consultar productos"
        });
    }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
    try {
        const [result] = await commysql.query("SELECT * FROM productos WHERE prod_id = ?", [req.params.id]);
        if (result.length <= 0) {
            return res.status(400).json({
                prod_id: 0,
                message: "Producto no encontrado"
            });
        }
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Error al consultar producto"
        });
    }
};

// Insertar un nuevo producto
export const postProducto = async (req, res) => {
    try {

        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo

        } = req.body;
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null

        // Verificar si ya existe un producto con el mismo código
        const [fila] = await commysql.query(
            'SELECT * FROM productos WHERE prod_codigo = ?', [prod_codigo]
        );

        if (fila.length > 0) {
            return res.status(409).json({
                id: 0,
                message: `Producto con código ${prod_codigo} ya existe.`
            })
        }
        console.log("Archivos imagen: ", req.file);
        const [result] = await commysql.query(
            "INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)",
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );

        res.json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({
            message: "Error al insertar producto"
        });
    }
};

// Actualizar producto completamente
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,

        } = req.body;
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null

        // Verificar si ya existe un producto con el mismo código (si es que se está cambiando)
        const [fila] = await commysql.query(
            'SELECT * FROM productos WHERE prod_codigo = ? AND prod_id != ?', [prod_codigo, id]
        );

        if (fila.length > 0) {
            return res.status(409).json({
                id: 0,
                message: `Producto con código ${prod_codigo} ya existe.`
            });
        }
        console.log("Archivos imagen: ", req.file);

        const [result] = await commysql.query(
            "UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?",
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(400).json({
                message: "Producto no encontrado para actualizar"
            });
        }

        const [row] = await commysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar producto"
        });
    }
};

// Actualizar parcialmente un producto
export const patchProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo

        } = req.body;

        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null

        // Verificar si ya existe un producto con el mismo código (si es que se está cambiando)
        if (prod_codigo) {
            const [fila] = await commysql.query(
                'SELECT * FROM productos WHERE prod_codigo = ? AND prod_id != ?', [prod_codigo, id]
            );

            if (fila.length > 0) {
                return res.status(409).json({
                    id: 0,
                    message: `Producto con código ${prod_codigo} ya existe.`
                });
            }
        }

        const [result] = await commysql.query(
            `UPDATE productos SET 
                prod_codigo = IFNULL(?, prod_codigo), 
                prod_nombre = IFNULL(?, prod_nombre), 
                prod_stock = IFNULL(?, prod_stock), 
                prod_precio = IFNULL(?, prod_precio), 
                prod_activo = IFNULL(?, prod_activo), 
                prod_imagen = IFNULL(?, prod_imagen)
            WHERE prod_id = ?`,
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(400).json({
                message: "Producto no encontrado para actualizar"
            });
        }

        const [row] = await commysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        console.error("Error en patchProducto:", error);
        return res.status(500).json({
            message: "Error al actualizar producto parcialmente"
        });
    }
};

// Eliminar producto por ID
export const deleteProductoById = async (req, res) => {
    try {
        const [result] = await commysql.query("DELETE FROM productos WHERE prod_id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Producto no encontrado"
            });
        }

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar producto"
        });
    }
};
