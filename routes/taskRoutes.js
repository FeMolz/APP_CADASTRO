// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../config/cloudinaryConfig');
const Task = require('../models/Task');

// GET /api/tasks - Pega todas as tarefas do usuário logado
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
});

// POST /api/tasks - Cria uma nova tarefa
router.post('/', auth, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            user: req.user.id,
            imageUrl: req.file ? req.file.path : '' // Salva a URL do Cloudinary se houver imagem
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// DELETE /api/tasks/:id - Deleta uma tarefa
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Tarefa não encontrada.' });
        // Garante que o usuário só pode deletar sua própria tarefa
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado.' });
        }
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tarefa removida.' });
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
});

// Adicione aqui as rotas PUT (editar) no futuro
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const taskId = req.params.id;

    try {
        // Encontra a tarefa no banco de dados
        let task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ msg: 'Tarefa não encontrada.' });
        }

        // Garante que o usuário só pode editar sua própria tarefa
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Não autorizado.' });
        }

        // Monta o objeto com os campos atualizados
        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (req.file) updatedFields.imageUrl = req.file.path; // Atualiza a imagem se uma nova for enviada

        // Atualiza a tarefa no banco de dados
        task = await Task.findByIdAndUpdate(
            taskId,
            { $set: updatedFields },
            { new: true, runValidators: true } // 'new: true' retorna o documento atualizado
        );

        res.json(task); // Retorna a tarefa atualizada

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;