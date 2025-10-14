// server.js
const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir que o Express entenda JSON
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o Banco de Dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB...'))
.catch(err => console.error('Não foi possível conectar ao MongoDB...', err));

// Usar as rotas de usuário
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.send('API de Cadastro de Usuários está no ar!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});