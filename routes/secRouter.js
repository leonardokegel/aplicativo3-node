const express = require('express');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secRouter = express.Router();
const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    }
});

secRouter.post('/register', express.json(), (req, res) => {
    console.log(req.body.login)
    console.log(req.body.senha)
    knex('usuario')
        .insert({
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8)
        }, ['login'])
        .then((result) => {
            let usuario = result[0];
            res.status(200).json({
                mensagem: `Usuario ${usuario.login} inserido com sucesso!`
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao registrar usuario - ' + err.message
            })
        })
});

module.exports = secRouter;