// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String }, // URL da imagem salva no Cloudinary
    isCompleted: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Adicionaremos isso no futuro
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Task', TaskSchema);