function onLoadHome() {
    localStorage.clear();
}

function onClickLogar() {
    let login = document.getElementById('loginHome').value;
    let senha = document.getElementById('senhaHome').value;

    if (login && senha) {
        fetch('https://pwn-lkpt-aplicativo3.herokuapp.com/sec/login', {
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
        fetch('https://pwn-lkpt-aplicativo3.herokuapp.com/sec/register', {
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

}

function onClickCadastrarDados() {
    const dadosSessao = JSON.parse(localStorage.getItem('dadosSessao'));
    if (dadosSessao) {
        let telefone = document.getElementById('tel').value;
        let email = document.getElementById('email').value;
        let sexo = document.getElementById('sexo').value;
        let estado = document.getElementById('estado').value;
        let cidade = document.getElementById('cidade').value;

        if (telefone && email && sexo && estado && cidade) {
            console.log(dadosSessao.id)
            fetch(`https://pwn-lkpt-aplicativo3.herokuapp.com/clientes/v1/clientes/`, {
                method: 'POST',
                body: JSON.stringify({
                    id: dadosSessao.id,
                    telefone,
                    email,
                    sexo,
                    estado,
                    cidade
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": `Bearer ${dadosSessao.token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.statusCode === 401) {
                        document.getElementById('no-content').innerHTML = '<p style="margin-top: 8px">Sessão expirada, fazer login novamente!!</p>';
                        document.getElementById('mensagemErro').innerHTML = 'Sessão expirada, fazer login novamente!!';
                        return;
                    }
                    if (data.statusCode !== 500) {
                        var goTo = '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/excluir-dados.html">Excluir Dados</a>';
                        goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/alterar-dados.html">Alterar Dados</a>';
                        goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/consulta.html">Consultar Dados</a>';
                        goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';
                        document.getElementById('goto').innerHTML = goTo;
                        document.getElementById('mensagemSucesso').innerHTML = 'Dados Cadastrados com sucesso!!';
                        document.getElementById('mensagemErro').innerHTML = '';

                    } else if (data.statusCode === 500) {
                        document.getElementById('mensagemErro').innerHTML = 'Erro ao cadastrar dados, tente novamente!';
                    } else {
                        document.getElementById('mensagemErro').innerHTML = 'Erro ao cadastrar dados, tente novamente!';
                    }
                })
                .catch(() => {
                    document.getElementById('mensagemErro').innerHTML = 'Erro ao cadastrar dados, tente novamente!';
                })
        } else {
            document.getElementById('mensagemSucesso').innerHTML = '';
            document.getElementById('mensagemErro').innerHTML = 'Preencher todos os campos!';
        }
    }

}

function carregarConsulta() {
    const dadosSessao = JSON.parse(localStorage.getItem('dadosSessao'));
    if (dadosSessao) {
        document.getElementById('boas-vindas').innerHTML = `Olá, ${dadosSessao.nome}!`
        fetch(`https://pwn-lkpt-aplicativo3.herokuapp.com/clientes/v1/clientes/${dadosSessao.id}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${dadosSessao.token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.statusCode === 401) {
                    var goTo = '<h3>Ir para</h3>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';
                    document.getElementById('goto').innerHTML = goTo;
                    document.getElementById('no-content').innerHTML = '<p style="margin-top: 8px">Sessão expirada, fazer login novamente!!</p>';
                    return;
                }
                if (data.id) {
                    var el = '<div class="main__content--dados">';
                    el += '<p class="label">telefone</p>';
                    el += `<p class="value">${data.telefone}</p></div>`;
                    el += '<div class="main__content--dados">';
                    el += '<p class="label">email</p>';
                    el += `<p class="value">${data.email}</p></div>`;
                    el += '<div class="main__content--dados">';
                    el += '<p class="label">sexo</p>';
                    el += `<p class="value">${data.sexo}</p></div>`;
                    el += '<div class="main__content--dados">';
                    el += '<p class="label">estado</p>';
                    el += `<p class="value">${data.estado}</p></div>`;
                    el += '<div class="main__content--dados">';
                    el += '<p class="label">Cidade</p>';
                    el += `<p class="value">${data.cidade}</p></div>`;

                    var goTo = '<h3>Ir para</h3>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/excluir-dados.html">Excluir Dados</a>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/alterar-dados.html">Alterar Dados</a>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';

                    document.getElementById('goto').innerHTML = goTo;
                    document.getElementById('main-content').innerHTML = el;
                } else if (data.statusCode === 404) {
                    var el = '<p style="margin-top: 8px">Você ainda não possui nenhum dado cadastrado.</p>';
                    el += '<a style="margin-top: 8px; text-decoration: underline; color: blue; font-weight: bold;" href="/home/cadastrar-dados.html">Cadastrar dados.</a>';

                    var goTo = '<h3>Ir para</h3>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home/cadastrar-dados.html">Cadastrar Dados</a>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';

                    document.getElementById('no-content').innerHTML = el;
                    document.getElementById('goto').innerHTML = goTo;
                } else {
                    document.getElementById('no-content').innerHTML = '<p style="margin-top: 8px">erro ao consultar dados!</p>';
                    var goTo = '<h3>Ir para</h3>';
                    goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';
                    document.getElementById('goto').innerHTML = goTo;
                }
            })
            .catch(() => {
                var goTo = '<h3>Ir para</h3>';
                goTo += '<a style="padding-left: 1rem; text-decoration: underline; color: blue; font-weight: bold;" href="/home">Login</a>';
                document.getElementById('goto').innerHTML = goTo;
                document.getElementById('no-content').innerHTML = '<p style="margin-top: 8px">erro ao consultar dados!</p>'
            });
    }
}

function excluirDados() {
    const dadosSessao = JSON.parse(localStorage.getItem('dadosSessao'));

    if (dadosSessao) {
        fetch(`https://pwn-lkpt-aplicativo3.herokuapp.com/clientes/v1/clientes/${dadosSessao.id}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${dadosSessao.token}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.statusCode === 401) {
                    document.getElementById('mensagemErro').innerHTML = 'Sessão expirada, fazer login novamente!';
                    return;
                }

                if (data.statusCode === 200) {
                    document.getElementById('mensagemSucesso').innerHTML = 'Dados Cadastados excluídos com sucesso!!';
                    document.getElementById('mensagemErro').innerHTML = '';
                } else {
                    document.getElementById('mensagemSucesso').innerHTML = '';
                    document.getElementById('mensagemErro').innerHTML = 'Erro ao excluir os dados!';
                }
            })
            .catch(() => {
                document.getElementById('mensagemSucesso').innerHTML = '';
                document.getElementById('mensagemErro').innerHTML = 'Erro ao excluir os dados!';
            })
    }
}

function backToHome() {
    window.location = '/home/consulta.html';
}

function onClickAtualizarDados() {
    const dadosSessao = JSON.parse(localStorage.getItem('dadosSessao'));

    if (dadosSessao) {
        let telefone = document.getElementById('tel').value;
        let email = document.getElementById('email').value;
        let sexo = document.getElementById('sexo').value;
        let estado = document.getElementById('estado').value;
        let cidade = document.getElementById('cidade').value;

        if (telefone && email && sexo && estado && cidade) {
            fetch(`https://pwn-lkpt-aplicativo3.herokuapp.com/clientes/v1/clientes/${dadosSessao.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    telefone,
                    email,
                    sexo,
                    estado,
                    cidade
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": `Bearer ${dadosSessao.token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.statusCode === 401) {
                        document.getElementById('mensagemErro').innerHTML = 'Sessão expirada, fazer login novamente!';
                        return;
                    }

                    if (data.statusCode === 200) {
                        document.getElementById('mensagemSucesso').innerHTML = 'Dados Cadastados alterados com sucesso!!';
                        document.getElementById('mensagemErro').innerHTML = '';
                    } else {
                        document.getElementById('mensagemSucesso').innerHTML = '';
                        document.getElementById('mensagemErro').innerHTML = 'Erro ao alterar dados!';
                    }
                })
                .catch(() => {
                    document.getElementById('mensagemSucesso').innerHTML = '';
                    document.getElementById('mensagemErro').innerHTML = 'Erro ao alterar dados!';
                })
        }
    } else {
        document.getElementById('mensagemErro').innerHTML = 'preencher todos os campos';
    }
}