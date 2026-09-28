import express from 'express';
import cors from 'cors';
import { conexao } from './conexao.js';

const app = express();
app.use(express.json());
app.use(cors());

// POST para salvar os dados no banco
app.post('/salvar-resultado', async (req, res) => {
    const { nome, idade, time, acertos, aproveitamento } = req.body;

    try {
        const pool = await conexao();
        const sql = "INSERT INTO resultados_usuarios (nome, idade, time_coracao, acertos, aproveitamento) VALUES (?, ?, ?, ?, ?)";
        const valores = [nome, idade, time, acertos, aproveitamento];

        await pool.query(sql, valores);
        
        res.status(200).json({ mensagem: "Resultado salvo com sucesso no banco de dados!" });
    } catch (erro) {
        console.error("Erro ao salvar no banco:", erro);
        res.status(500).json({ erro: "Erro interno no servidor ao salvar dados." });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 🚀");
});