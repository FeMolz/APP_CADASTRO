// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Pega o token do cabeçalho da requisição
    const authHeader = req.header('Authorization');

    // Verifica se o token existe
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // O formato do token é "Bearer <token>". Precisamos remover o "Bearer ".
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Formato de token inválido.' });
        }

        // Verifica se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Anexa o payload decodificado (que contém o ID do usuário) ao objeto da requisição
        req.user = decoded;

        // Passa para a próxima função (a rota em si)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = auth;