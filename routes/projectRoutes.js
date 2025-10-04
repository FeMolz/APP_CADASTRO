// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth'); // Importa nosso middleware de autenticação

// --- Rotas Protegidas ---

// ROTA: GET /api/projects
router.get('/', auth, async (req, res) => {
    try {
        // Busca projetos no DB que tenham o campo 'user' igual ao ID do usuário logado
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: 'desc' });
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor.');
    }
});

// ROTA: POST /api/projects
router.post('/', auth, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'O nome do projeto é obrigatório.' });
    }

    try {
        const newProject = new Project({
            name,
            user: req.user.id // Associa o projeto ao ID do usuário que vem do token
        });

        const project = await newProject.save();
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor.');
    }
});

module.exports = router;