let form = document.getElementById('formPreguntas');
let btnGrabar = document.getElementById('grabar');
let tabla = document.getElementById('tabla');
let cargando = document.getElementById('cargando');
let atras = document.getElementById('atras');

atras.disabled = false;

//función para habilitar el botón grabar
function verificarFormulario() {
  //si todo el form es correcto se habilita el botón grabar
  if (form.checkValidity()) {
    btnGrabar.disabled = false;
  } else {
    btnGrabar.disabled = true;
  }
}

//creamos una funcion que devuelve una promesa para que haga el tiempo de forma asíncrona
function retraso(tiempo) {
  return new Promise((resolver) => setTimeout(resolver, tiempo));
}

//funcion para mostrar los errores por pantalla si los hay
function mostrarError(mensaje) {
  let mensajeError = document.getElementById('mensajeError2');
  cargando.style.display = 'none';
  mensajeError.innerHTML = mensaje;
  mensajeError.style.display = 'block';
  tabla.style.display = 'none';
}

function guardarPregunta(pregunta, respuesta, puntuacion, estado) {
  //llamamos a la promesa y la resolvemos si tiene éxito, si no lo tiene mostramso un mensaje con rechazar.
  return new Promise((resolver, rechazar) => {
    try {

      let correoUsuario = getCookie('correoUsuario');
      if (!correoUsuario) {
        rechazar('ERROR');
        return;
      }
      let datosUsuario = getCookie('datosUsuario');
      if (!datosUsuario) {
        rechazar('ERROR');
        return;
      }
      //almacenamos la nueva pregunta y su respuesta en el array preguntas dentro de la cookie del usuario
      let datosUsuarioParse = JSON.parse(datosUsuario);
      datosUsuarioParse[correoUsuario].preguntas =
        datosUsuarioParse[correoUsuario].preguntas || [];
      datosUsuarioParse[correoUsuario].preguntas.push({
        pregunta,
        respuesta,
        puntuacion,
        estado,
      });
      //los enviamos y resolvemos
      setCookie('datosUsuario', JSON.stringify(datosUsuarioParse), 7);
      resolver();
    } catch (error) {
      rechazar(error.message);
    }
  });
}
//creo un contador para saber cuántas operaciones hay en el momento,
//lo hago fuera para que no se reinicie cada vez que se llama a la función
let contadorPreguntas = 0;

function nuevaPregunta() {
  let pregunta = document.getElementById('pregunta').value;
  let respuesta = form.elements['verdadero_falso'].value;
  let puntuacion = document.getElementById('puntuacion').value;
  let tbody = document.getElementById('bodyTabla');
  let columna = document.createElement('tr');
  columna.innerHTML = `
    <td>${pregunta}</td>
    <td>${respuesta}</td>
    <td>${puntuacion}</td>
    <td>Guardando...</td>
  `;
  //cada vez que entramos en la función sumamos 1 al contador
  contadorPreguntas++;
  // deshabilitamos el botón de atrás mientras se guardan preguntas
  atras.disabled = true;
  //añadimos el contenido a la tabla
  tbody.appendChild(columna);

  //llamamos a la función pasándole los 5s y luego ponemos en cada then lo que queremos que haga a continuación
  retraso(5000)
    .then(() => {
      return guardarPregunta(pregunta, respuesta, puntuacion, 'OK');
    })
    .then(() => {
      columna.innerHTML = `
        <td>${pregunta}</td>
        <td>${respuesta}</td>
        <td>${puntuacion}</td>
        <td>OK</td>
      `;
    })
    .catch((error) => {
      columna.innerHTML = `
        <td>${pregunta}</td>
        <td>${respuesta}</td>
        <td>${puntuacion}</td>
        <td>${error}</td>
      `;
    })
    .finally(() => {
      contadorPreguntas--;
      if (contadorPreguntas === 0) {
        atras.disabled = false;
      }
    });
  //reseteamos el formulario y llamamos a la función que lo verifica para que grabar vuelva a estar deshabilitado
  form.reset();
  verificarFormulario();
}
//por defecto no va a tener retraso a la hora de mostrar las preguntas almacenadas
function mostrarPreguntas(conRetraso = false) {
  if (conRetraso) {
    cargando.style.display = 'block';
    tabla.style.display = 'none';
    retraso(5000).then(() => {
      cargando.style.display = 'none';
      tabla.style.display = 'block';
      mostrarPreguntas(false);
    });
  } else {
    let tbody = document.getElementById('bodyTabla');
    tbody.innerHTML = '';
    let correoUsuario = getCookie('correoUsuario');
    if (correoUsuario) {
      let datosUsuario = getCookie('datosUsuario');
      if (datosUsuario) {
        let datosUsuarioParse = JSON.parse(datosUsuario);
        let preguntas = datosUsuarioParse[correoUsuario].preguntas || [];
        preguntas.forEach((pregunta) => {
          let columna = document.createElement('tr');
          columna.innerHTML = `
            <td>${pregunta.pregunta}</td>
            <td>${pregunta.respuesta}</td>
            <td>${pregunta.puntuacion}</td>
            <td>${pregunta.estado}</td>
          `;
          tbody.appendChild(columna);
        });
        cargando.style.display = 'none';
        tabla.style.display = 'block';
      } else {
        mostrarError('El correo no tiene datos');
      }
    } else {
      mostrarError('No existe el correo introducido');
    }
  }
}

form.addEventListener('input', verificarFormulario);
btnGrabar.addEventListener('click', nuevaPregunta);
atras.addEventListener('click', function redirigir() {
  window.location.href = '2.html';
});
mostrarPreguntas(true);
