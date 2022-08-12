function onLoadHome() {
    localStorage.clear();
}

function onClickLogar() {
    let login = document.getElementById('loginHome').value;
    let senha = document.getElementById('senhaHome').value;

    if (login && senha) {
        fetch('http://localhost:3000/sec/login', {
            method: 'POST',
            body: JSON.stringify({
                login,
                senha
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (!data.token) {
                    document.getElementById('erroLogin').innerHTML = 'Usuário ou senha incorreto!';
                } else {
                    localStorage.setItem('dadosSessao', JSON.stringify({
                        nome: data.nome,
                        token: data.token,
                        id: data.id
                    }));
                    window.location = '/home/consulta.html';
                    document.getElementById('erroLogin').innerHTML = '';
                }
            })
            .catch((err) => console.log(err))
    }
}

function onClickCadastrar() {
    let login = document.getElementById('login').value;
    let senha = document.getElementById('senha').value;
    let nome = document.getElementById('nome').value;

    if (login && senha && nome) {
        fetch('http://localhost:3000/sec/register', {
            method: 'POST',
            body: JSON.stringify({
                login,
                senha,
                nome
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data && data.statusCode !== 500) {
                    document.getElementById('mensagemSucesso').innerHTML = data.mensagem;
                    document.getElementById('mensagemErro').innerHTML = '';
                } else if (data && data.statusCode === 500) {
                    document.getElementById('mensagemErro').innerHTML = data.mensagem;
                } else {
                    document.getElementById('mensagemErro').innerHTML = 'Erro ao inserir usuário!';
                }
            })
            .catch((err) => {
                document.getElementById('mensagemErro').innerHTML = 'Erro ao inserir usuário!';
                console.log(err)
            })
    } else {
        document.getElementById('mensagemErro').innerHTML = 'Preencher todos os campos!';
    }

    // let nome = document.getElementById('nome').value;
    // let tel = document.getElementById('tel').value;
    // let email = document.getElementById('email').value;
    // let sexo = document.getElementById('sexo').value;
    // let estado = document.getElementById('estado').value;
    // let cidade = document.getElementById('cidade').value;

    // if (nome && tel && email && sexo && estado && cidade) {
    //     cadastrarCliente(nome, tel, email, sexo, estado, cidade);
    // }
}

// function cadastrarCliente(nome, telefone, email, sexo, estado, cidade) {
//     console.log(nome, telefone, email, sexo, estado, cidade)
//     fetch('http://localhost:3000/clientes/v1/clientes/', {
//         method: 'POST',
//         body: JSON.stringify({
//             nome,
//             telefone,
//             email,
//             sexo,
//             estado,
//             cidade
//         }),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err))

// }

function carregarConsulta() {
    const dadosSessao = JSON.parse(localStorage.getItem('dadosSessao'));
    if (dadosSessao) {
        document.getElementById('boas-vindas').innerHTML = `Olá, ${dadosSessao.nome}!`
        fetch(`http://localhost:3000/clientes/v1/clientes/${dadosSessao.id}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.statusCode === 404 ) {
                
            }
        })
        .catch((err) => console.log(err))

    }
}