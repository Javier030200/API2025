import { commysql } from '../bd.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [result] = await commysql.query('SELECT * FROM usuarios');
        res.json({ cant: result.length, data: result });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

// Obtener un usuario por ID
export const getUsuariosxid = async (req, res) => {
    try {
        const [result] = await commysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

// Insertar un nuevo usuario
export const postUsuarios = async (req, res) => {
    try {
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;
        const [result] = await commysql.query(
            `INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo]
        );
        res.send({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error al insertar usuario" });
    }
};

// Actualizar todos los campos de un usuario
export const putUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        const [result] = await commysql.query(
            `UPDATE usuarios SET 
                usr_usuario = ?, 
                usr_clave = ?, 
                usr_nombre = ?, 
                usr_telefono = ?, 
                usr_correo = ?, 
                usr_activo = ?
             WHERE usr_id = ?`,
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const [row] = await commysql.query("SELECT * FROM usuarios WHERE usr_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

// Actualización parcial de un usuario
export const patchUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        const [result] = await commysql.query(
            `UPDATE usuarios SET 
                usr_usuario = IFNULL(?, usr_usuario),
                usr_clave = IFNULL(?, usr_clave),
                usr_nombre = IFNULL(?, usr_nombre),
                usr_telefono = IFNULL(?, usr_telefono),
                usr_correo = IFNULL(?, usr_correo),
                usr_activo = IFNULL(?, usr_activo)
            WHERE usr_id = ?`,
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const [row] = await commysql.query("SELECT * FROM usuarios WHERE usr_id = ?", [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

// Eliminar usuario
export const deleteUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await commysql.query("DELETE FROM usuarios WHERE usr_id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
