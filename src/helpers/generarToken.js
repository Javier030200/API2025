import jwt from 'jsonwebtoken'

export function generarToken(usuario) {
    return jwt.sign(
        {
            id: usuario.usr_id,
            nombre: usuario.usr_nombre,
            correo: usuario.usr_correo
        },
        process.env.JWT_SECRETO || 'secreto123',
        { expiresIn: '1h' }
    )
}
