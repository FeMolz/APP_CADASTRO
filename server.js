// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

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

// Rota principal
app.get('/', (req, res) => {
  res.send('API de Cadastro de Usuários está no ar!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});