import { commysql } from '../bd.js';
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import { generarToken } from '../helpers/generarToken.js'


//Iniciar Sesion
export const iniciarSesion = async (req, res) => {
    const { correo, clave } = req.body;
    try {
        const correoLimpio = correo.trim().toLowerCase(); //elimina espacios y lo convierte a minúscula
        const [usuarios] = await commysql.query(
            'SELECT * FROM usuarios WHERE usr_correo = ?',
            [correoLimpio]
        );
        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const usuario = usuarios[0];
        const claveValida = await bcrypt.compare(clave, usuario.usr_clave);
        if (!claveValida) {
            return res.status(401).json({ mensaje: 'Clave incorrecta' });
        }
        const token = generarToken(usuario);
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.usr_id,
                nombre: usuario.usr_nombre,
                correo: usuario.usr_correo
            }
        });
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};



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

        // Verifica si ya existe un usuario con el mismo correo
        const [usuariosExistentes] = await commysql.query(
            'SELECT * FROM usuarios WHERE usr_correo = ?',
            [usr_correo.trim()]
        );

        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ mensaje: "Ya existe un usuario con este correo" });
        }

        // Hashear la clave antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const claveHasheada = await bcrypt.hash(usr_clave, salt);

        const [result] = await commysql.query(
            `INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usr_usuario, claveHasheada, usr_nombre, usr_telefono, usr_correo.trim(), usr_activo]
        );
        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        return res.status(500).json({ mensaje: "Error al insertar usuario" });
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
