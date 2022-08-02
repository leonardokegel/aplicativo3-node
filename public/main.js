function onClickLogar() {
    console.log('alo')
}

function onClickCadastrar() {
    let login = document.getElementById('login').value;
    let senha = document.getElementById('senha').value;

    if (login && senha) {
        fetch('http://localhost:3000/sec/register', {
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
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
        // fetch("http://localhost:3000/sec/register", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         login: login,
        //         senha: senha
        //     }),
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     }
        // })
        //     .then(response => response.json())
        //     .then(json => console.log(json));
    }
    console.log(login, senha)
    // history.back();
}