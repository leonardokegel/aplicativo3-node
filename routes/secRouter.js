const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
const { response } = require('express');
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
    knex('usuario')
        .where({ login: req.body.login })
        .then((usuario) => {
            if (usuario.length < 1) {
                knex('usuario')
                    .insert({
                        login: req.body.login,
                        senha: bcrypt.hashSync(req.body.senha, 8),
                        nome: req.body.nome
                    }, ['login'])
                    .then((result) => {
                        let usuario = result[0];
                        res.status(200).json({
                            mensagem: `Usuario ${usuario.login} inserido com sucesso!`
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            mensagem: 'Erro ao registrar usuario - ' + err.message
                        })
                    });
            } else {
                res.status(500).json({
                    mensagem: 'Usuário já cadastrado!',
                    statusCode: 500
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                mensagem: 'Erro ao registrar usuario - ' + err.message
            })
        })

});

secRouter.post('/login', express.json(), (req, res) => {
    knex
        .select('*').from('usuario').where({
            login: req.body.login
        })
        .then((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0];
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha);
                if (checkSenha) {
                    var tokenJWT = jwt.sign(
                        { id: usuario.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    });
                    res.status(200).json({
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.nome,
                        token: tokenJWT
                    });
                } else {
                    res.status(200).json({ message: 'Login ou senha incorretos' })
                }
            } else {
                res.status(200).json({ message: 'Login ou senha incorretos' })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar login - ' + err.message
            })
        });
});

module.exports = secRouter;