const express = require('express');
const morgan = require('morgan');
const apiRouter = require('./routes/apiRouter');
const clientRouter = require('./routes/clientRouter');
const secRouter = require('./routes/secRouter');
const port = process.env.PORT || 3333;
const app = express();

app.use(morgan('tiny'));
app.use('/clientes/v1/', apiRouter)
app.use('/home', clientRouter);
app.use('/sec', secRouter);
app.listen(port, () => {
    console.info(`App rodando na porta ${port}`);
});