$(() => {

    let token = localStorage.getItem('jwt_token');

    if (token) {
        //mostramos links 
        $('#link_chile').show()
        $('#link_logout').show()
        //ocultamos links
        $('#link_login').hide()

    } else {

    }


    $('#boton_login').on('click', function () {
        let email = $('#text-email').val();
        let password = $('#text-password').val();


        //document.getElementById("formulario_login").reset()

        let urlLogin = 'http://localhost:3000/api/login'

        //CREAMOS PAYLOAD PARA SOLICITAR JWT A LA API.
        let payload = {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }

        fetch(urlLogin, payload)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                let { token } = data;

                if (token) {
                    localStorage.setItem('jwt_token', token)
                    alert('Se ha iniciado sesión correctamente.')
                    location.reload();
                } else {
                    alert(data.message)
                }
            })
            .catch((error) => {
                alert('Ha ocurrido un error al consumir la API Login');
            })

    })



    /* 7. Al hacer click sobre el link Cerrar sesión del menú se debe volver al estado inicial de
    la aplicación, eliminar el token y ocultar los link de Situación Chile y Cerrar sesión,
    además de volver a mostrar Iniciar sesión. (1 Punto) */

    $('#link_logout').on('click', function () {
        localStorage.clear();
        location.href = './';
    })


})