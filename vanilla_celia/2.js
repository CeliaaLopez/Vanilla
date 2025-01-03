let btn = document.getElementById('btnPregunta');

function mostrarCorreo() {
  let correoUsuario = getCookie('correoUsuario');
  // Comprobamos si existe la cookie 'usuario'
  if (correoUsuario) {
    let datosUsuario = getCookie('datosUsuario');
    // Comprobamos si existe la cookie 'correosUsuarios'
    if (datosUsuario) {
      // Parseamos el JSON de vuelta a un objeto para poder acceder a los datos
      let datosUsuarioParse = JSON.parse(datosUsuario);
      let correo = document.getElementById('mostrarCorreo');
      let texto = document.createTextNode(
        'Hola ' + datosUsuarioParse[correoUsuario].correo + '!'
      );
      let texto2;
      // Comprobamos si existe la fecha anterior y la hora anterior
      if (
        datosUsuarioParse[correoUsuario].fechaAnterior &&
        datosUsuarioParse[correoUsuario].horaAnterior
      ) {
        texto2 = document.createTextNode(
          'La última vez que entraste fue el ' +
            datosUsuarioParse[correoUsuario].fechaAnterior +
            ' a las ' +
            datosUsuarioParse[correoUsuario].horaAnterior
        );
      } else {
        texto2 = document.createTextNode('¡Primera vez que nos vemos!');
      }
      // Añadimos los textos al HTML
      correo.appendChild(texto);
      correo.appendChild(document.createElement('br'));
      correo.appendChild(texto2);
    } else {
      // Si no se encuentra la cookie 'correosUsuarios', mostramos un mensaje de error
      document.getElementById('mostrarCorreo').innerHTML =
        'El correo no tiene asociados ningún dato';
    }
  } else {
    // Si no se encuentra la cookie 'usuario', mostramos un mensaje de error
    document.getElementById('mostrarCorreo').innerHTML =
      'No se encontró el correo indicado';
  }
}

mostrarCorreo();

// Redirigimos a la página 3 cuando se hace clic en el botón
btn.addEventListener('click', function redirigir() {
  window.location.href = '3.html';
});
