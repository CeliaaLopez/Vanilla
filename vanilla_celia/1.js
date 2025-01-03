let h1 = document.getElementById('Bienvenido');
let inputForm = document.getElementById('name');
let mensajeError = document.getElementById('mensajeError');

//función para ocultar el h1 si se pulsa Ctrl + b
function bienvenida(event) {
  if (event.ctrlKey && event.key === 'b') {
    h1.style.display = 'none';
  }
}
//si no se pulsa ninguna tecla a los 5 segundos desactivaremos el h1
setTimeout(() => {
  h1.style.display = 'none';
}, 5000);

//función para validar el correo y almacenar los datos en una cookie
function validar(value) {
  let patron = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //comprobamos que el patrón de correo sea válido
  if (patron.test(inputForm.value)) {
    let datosUsuario = getCookie('datosUsuario');
    //ahora, comprobamos si ya existe una cookie con el correo, si existe la parseamos, si no, la creamos vacía
    let cookieAnterior = datosUsuario ? JSON.parse(datosUsuario) : {};
    //si existe añadimos actualizamos la fecha y hora de la última sesión
    if (cookieAnterior[inputForm.value]) {
      cookieAnterior[inputForm.value].horaAnterior =
        cookieAnterior[inputForm.value].horaSesion;
      cookieAnterior[inputForm.value].fechaAnterior =
        cookieAnterior[inputForm.value].fechaSesion;
    }
    //guardamos los datos del usuario en formato JSON
    cookieAnterior[inputForm.value] = {
      //mantenemos los datos si los hay con los ...
      ...cookieAnterior[inputForm.value],
      correo: inputForm.value,
      horaSesion: new Date().toLocaleTimeString(),
      fechaSesion: new Date().toLocaleDateString(),
    };
    //creamos una cookie con el correo del usuario
    setCookie('correoUsuario', inputForm.value, 7);
    //Creamos otra cookie con los datos del usuario en forma de JSON
    setCookie('datosUsuario', JSON.stringify(cookieAnterior), 7);
    //redirigimos a la página 2
    window.location.href = '2.html';
  } else {
    //si el correo no es válido mostramos el mensaje que está deshabilitado
    mensajeError.style.display = 'block';
    //seleccionamos el texto
    inputForm.select();
  }
}
document.addEventListener('keydown', bienvenida);
inputForm.addEventListener('blur', validar);
