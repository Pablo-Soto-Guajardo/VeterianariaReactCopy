// Reglas de validación de formularios.
// Cada función devuelve "" cuando el valor es válido o un mensaje de error.
// Las reglas provienen de la Evaluación 1 y se reutilizan en todos los formularios.

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export function calcularDigitoVerificador(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export function validarRun(valor) {
  const run = valor.trim().toUpperCase();
  if (run === "") return "El RUN es obligatorio";
  if (!/^[0-9]{7,8}[0-9K]$/.test(run)) {
    return "RUN sin puntos ni guion, entre 8 y 9 caracteres (ej: 190110222)";
  }
  const cuerpo = run.slice(0, -1);
  const digito = run.slice(-1);
  if (calcularDigitoVerificador(cuerpo) !== digito) {
    return "El dígito verificador del RUN no es correcto";
  }
  return "";
}

export function validarTextoObligatorio(valor, nombreCampo, maximo) {
  const texto = valor.trim();
  if (texto === "") return `${nombreCampo} es obligatorio`;
  if (texto.length > maximo) return `Máximo ${maximo} caracteres`;
  return "";
}

export function validarCorreo(valor) {
  const correo = valor.trim().toLowerCase();
  if (correo === "") return "El correo es obligatorio";
  if (correo.length > 100) return "Máximo 100 caracteres";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return "Formato de correo no válido";
  const dominioValido = DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio));
  if (!dominioValido) return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
  return "";
}

export function validarContrasena(valor) {
  if (valor === "") return "La contraseña es obligatoria";
  if (valor.length < 4 || valor.length > 10) {
    return "La contraseña debe tener entre 4 y 10 caracteres";
  }
  return "";
}

export function validarConfirmacion(contrasena, confirmacion) {
  if (confirmacion !== contrasena) return "Las contraseñas no coinciden";
  return "";
}

export function validarFechaNacimiento(valor, hoy = new Date()) {
  if (valor === "") return "";
  const fecha = new Date(`${valor}T00:00:00`);
  if (fecha > hoy) return "La fecha de nacimiento no puede ser futura";
  return "";
}

export function validarSeleccion(valor, mensaje) {
  return valor === "" ? mensaje : "";
}

// Elimina los campos sin error para saber si el formulario es válido.
function limpiarErrores(errores) {
  const resultado = {};
  for (const [campo, mensaje] of Object.entries(errores)) {
    if (mensaje) resultado[campo] = mensaje;
  }
  return resultado;
}

export function esFormularioValido(errores) {
  return Object.keys(errores).length === 0;
}

export function validarUsuario(datos, { requiereContrasena = true, validarRol = false } = {}) {
  const errores = {
    run: validarRun(datos.run),
    nombre: validarTextoObligatorio(datos.nombre, "El nombre", 50),
    apellidos: validarTextoObligatorio(datos.apellidos, "Los apellidos", 100),
    correo: validarCorreo(datos.correo),
    direccion: validarTextoObligatorio(datos.direccion, "La dirección", 300),
    region: validarSeleccion(datos.region, "Selecciona una región"),
    comuna: validarSeleccion(datos.comuna, "Selecciona una comuna"),
    fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento)
  };

  if (validarRol) {
    errores.rol = validarSeleccion(datos.rol, "Selecciona un rol");
  }

  // Al editar, la contraseña puede quedar vacía para conservar la actual.
  if (requiereContrasena || datos.contrasena !== "") {
    errores.contrasena = validarContrasena(datos.contrasena);
    errores.confirmarContrasena = validarConfirmacion(
      datos.contrasena,
      datos.confirmarContrasena
    );
  }

  return limpiarErrores(errores);
}

export function validarLogin(datos) {
  const errores = {
    correo: validarCorreo(datos.correo),
    contrasena: validarContrasena(datos.contrasena)
  };
  return limpiarErrores(errores);
}

export function validarContacto(datos) {
  const errores = {
    nombre: validarTextoObligatorio(datos.nombre, "El nombre", 100),
    correo: validarCorreo(datos.correo),
    comentario: validarTextoObligatorio(datos.comentario, "El comentario", 500)
  };
  return limpiarErrores(errores);
}

function validarEntero(valor, nombreCampo, obligatorio) {
  if (valor === "" || valor === null || valor === undefined) {
    return obligatorio ? `${nombreCampo} es obligatorio` : "";
  }
  const numero = Number(valor);
  if (!Number.isInteger(numero)) return `${nombreCampo} debe ser un número entero`;
  if (numero < 0) return `${nombreCampo} no puede ser negativo`;
  return "";
}

export function validarProducto(datos) {
  const errores = {
    codigo:
      datos.codigo.trim().length < 3
        ? "El código es obligatorio y debe tener al menos 3 caracteres"
        : "",
    nombre: validarTextoObligatorio(datos.nombre, "El nombre", 100),
    descripcion: datos.descripcion.length > 500 ? "Máximo 500 caracteres" : "",
    precio: validarEntero(datos.precio, "El precio", true),
    stock: validarEntero(datos.stock, "El stock", true),
    stockCritico: validarEntero(datos.stockCritico, "El stock crítico", false),
    categoria: validarSeleccion(datos.categoria, "Selecciona una categoría")
  };

  if (!errores.precio && datos.precioOferta !== "") {
    const oferta = validarEntero(datos.precioOferta, "El precio de oferta", false);
    if (oferta) {
      errores.precioOferta = oferta;
    } else if (Number(datos.precioOferta) >= Number(datos.precio)) {
      errores.precioOferta = "La oferta debe ser menor que el precio normal";
    }
  }

  return limpiarErrores(errores);
}

export function validarCategoria(datos) {
  const errores = {
    nombre: validarTextoObligatorio(datos.nombre, "El nombre", 50),
    descripcion: datos.descripcion.length > 200 ? "Máximo 200 caracteres" : ""
  };
  return limpiarErrores(errores);
}

export function validarTarjeta(valor) {
  const numero = valor.replace(/\s/g, "");
  if (numero === "") return "El número de tarjeta es obligatorio";
  if (!/^[0-9]{16}$/.test(numero)) return "La tarjeta debe tener 16 dígitos";
  return "";
}

export function validarCheckout(datos) {
  const errores = {
    nombre: validarTextoObligatorio(datos.nombre, "El nombre", 50),
    apellidos: validarTextoObligatorio(datos.apellidos, "Los apellidos", 100),
    correo: validarCorreo(datos.correo),
    calle: validarTextoObligatorio(datos.calle, "La calle", 300),
    region: validarSeleccion(datos.region, "Selecciona una región"),
    comuna: validarSeleccion(datos.comuna, "Selecciona una comuna"),
    indicaciones: datos.indicaciones.length > 300 ? "Máximo 300 caracteres" : "",
    tarjeta: validarTarjeta(datos.tarjeta)
  };
  return limpiarErrores(errores);
}
