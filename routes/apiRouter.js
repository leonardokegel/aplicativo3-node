require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const apiRouter = express.Router();
const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    }
});

let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"];
    if (!authToken) {
        res.status(401).json({
            message: 'token de acesso requirido!',
            statusCode: 401
        })
    } else {
        let token = authToken.split(' ')[1];
        req.token = token;
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            res.status(401).json({
                message: 'Acesso negado',
                statusCode: 401
            });
            return;
        }
        req.usuarioId = decodeToken.id;
        next();
    });
}

apiRouter.get('/clientes', express.json(), function (req, res) {
    knex.select('*').from('clientes')
        .then((clientes) => res.status(200).json(clientes))
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
});

apiRouter.get('/clientes/:id_cliente', checkToken, express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    knex('clientes')
        .where({ id: id_cliente })
        .then((cliente) => {
            if (cliente.length > 0) {
                res.status(200).json(cliente[0])
            } else {
                res.status(404).json({
                    message: `cliente não encontrado!`,
                    statusCode: 404
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
});


apiRouter.post('/clientes/', checkToken, express.json(), function (req, res) {
    if (validaBody(req, res)) {
        knex('clientes')
            .insert({
                id: req.body.id,
                telefone: req.body.telefone,
                email: req.body.email,
                sexo: req.body.sexo,
                estado: req.body.estado,
                cidade: req.body.cidade
            }, ['id', 'telefone', 'email', 'sexo', 'estado', 'cidade'])
            .then((cliente) => {
                res.status(200).json(cliente[0])
            })
            .catch((err) => {
                res.status(500).json({
                    message: `Erro ao recuperar os clientes, ${err.message}`,
                    statusCode: 500
                });
            });
    } else {
        res.end();
    }

});

apiRouter.delete('/clientes/:id_cliente', checkToken, express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    knex('clientes')
        .where({ id: id_cliente })
        .del()
        .then((cliente) => {
            if (cliente >= 1) {
                res.status(200).json({
                    message: 'cliente deletado!',
                    statusCode: 200
                });
            } else {
                res.status(404).json({
                    message: 'cliente não encontrado!',
                    statusCode: 404
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`,
                statusCode: 500
            });
        });
});

apiRouter.put('/clientes/:id_cliente', checkToken, express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    if (validaBody(req, res)) {
        knex('clientes')
            .where({ id: id_cliente })
            .update({
                telefone: req.body.telefone,
                email: req.body.email,
                sexo: req.body.sexo,
                estado: req.body.estado,
                cidade: req.body.cidade
            }, ['telefone', 'email', 'sexo', 'estado', 'cidade'])
            .then((cliente) => {
                if (cliente.length > 0) {
                    res.status(200).json({
                        message: 'dados alterados com sucesso!',
                        statusCode: 200
                    });
                } else {
                    res.status(404).json({
                        message: 'cliente não encontrado!',
                        statusCode: 404
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: `Erro ao recuperar os clientes, ${err.message}`,
                    statusCode: 500
                });
            });
    } else {
        res.end();
    }
});

function validaBody(req, res) {
    if (!req.body.telefone) {
        returnError400(res, 'telefone');
        return false;
    } else if (!req.body.email) {
        returnError400(res, 'email');
        return false;
    } else if (!req.body.sexo) {
        returnError400(res, 'sexo');
        return false;
    } else if (!req.body.estado) {
        returnError400(res, 'estado');
        return false;
    } else if (!req.body.cidade) {
        returnError400(res, 'cidade');
        return false;
    }
    return true;
}

function returnError400(res, property) {
    res.status(400).json({
        message: `O campo '${property}' é obrigatório!`
    });
}

module.exports = apiRouter;
