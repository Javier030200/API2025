import jwt from 'jsonwebtoken'

export function verificarToken(req, res, next) {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' })

    try {
        const tokenLimpio = token.replace('Bearer ', '')
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRETO || 'secreto123')
        req.usuario = verificado
        next()
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado' })
    }
}
