const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para garantir a codificação UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    next();
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para servir o arquivo JSON
app.get('/data', (req, res) => {
    const data = require('./data.json');
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
