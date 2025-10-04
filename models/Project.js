// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome do projeto é obrigatório.'],
        trim: true // Remove espaços em branco do início e do fim
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Armazena o ID do usuário
        ref: 'User', // Cria uma referência ao modelo 'User'
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);