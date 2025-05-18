import jwt from 'jsonwebtoken'

export function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, perfil: usuario.perfil },
        process.env.JWT_SECRETO || 'secreto123',
        { expiresIn: '1h' }
    )
}