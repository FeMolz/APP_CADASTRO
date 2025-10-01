// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true, // Garante que não haverá dois e-mails iguais
    match: [/^([a-zA-Z0-9._%-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/, 'Por favor, insira um e-mail válido.'],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    select: false, // Para não trazer a senha em consultas
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);