// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

module.exports = router;