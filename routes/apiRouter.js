require('dotenv').config();
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

apiRouter.get('/clientes', express.json(), function (req, res) {
    knex.select('*').from('clientes')
        .then((clientes) => res.status(200).json(clientes))
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
});

apiRouter.get('/clientes/:id_cliente', express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    knex('clientes')
        .where({ id: id_cliente })
        .then((cliente) => {
            if (cliente.length > 0) {
                res.status(200).json(cliente[0])
            } else {
                res.status(404).json({
                    message: `cliente não encontrado!`
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
});

apiRouter.post('/clientes', express.json(), function (req, res) {
    if (validaBody(req, res)) {
        knex('clientes')
            .insert({
                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email,
                sexo: req.body.sexo,
                estado: req.body.estado,
                cidade: req.body.cidade
            }, ['id', 'nome', 'telefone', 'email', 'sexo', 'estado', 'cidade'])
            .then((cliente) => {
                res.status(200).json(cliente[0])
            })
            .catch((err) => {
                res.status(500).json({
                    message: `Erro ao recuperar os clientes, ${err.message}`
                });
            });
    } else {
        res.end();
    }

});

apiRouter.delete('/clientes/:id_cliente', express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    knex('clientes')
        .where({ id: id_cliente })
        .del()
        .then((cliente) => {
            if (cliente >= 1) {
                res.status(200).json({
                    message: 'cliente deletado!'
                });
            } else {
                res.status(404).json({
                    message: 'cliente não encontrado!'
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
});

apiRouter.put('/clientes/:id_cliente', express.json(), function (req, res) {
    let id_cliente = +req.params.id_cliente;
    if (validaBody(req, res)) {
        knex('clientes')
        .where({ id: id_cliente })
        .update({
            nome: req.body.nome,
            telefone: req.body.telefone,
            email: req.body.email,
            sexo: req.body.sexo,
            estado: req.body.estado,
            cidade: req.body.cidade
        }, ['id', 'nome', 'telefone', 'email', 'sexo', 'estado', 'cidade'])
        .then((cliente) => {
            if (cliente.length > 0) {
                res.status(204).json({});
            } else {
                res.status(404).json({
                    message: 'cliente não encontrado!'
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: `Erro ao recuperar os clientes, ${err.message}`
            });
        });
    } else {
        res.end();
    }
});

function validaBody(req, res) {
    if (!req.body.nome) {
        returnError400(res, 'nome');
        return false;
    } else if (!req.body.telefone) {
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
