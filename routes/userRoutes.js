// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validação simples dos dados recebidos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    // 2. Verificar se o usuário já existe no banco de dados
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    // 3. Criptografar a senha (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Criar o novo usuário
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Salvar o usuário no banco de dados
    const newUser = await user.save();

    // 6. Enviar a resposta de sucesso (sem a senha)
    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

// Rota POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validar se email e senha foram enviados
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
        }

        // 2. Encontrar o usuário no banco de dados pelo e-mail
        // Usamos .select('+password') para incluir a senha na busca, já que no modelo ela está com select: false
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
        }

        // 3. Comparar a senha enviada com a senha hasheada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mesma mensagem genérica
        }

        // 4. Se tudo estiver correto, criar e assinar o token JWT
        const payload = {
            id: user._id,
            name: user.name,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // 5. Enviar o token de volta para o cliente
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;