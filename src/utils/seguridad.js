// Ofusca una contraseña antes de guardarla en localStorage.
// No es cifrado real: en esta etapa no existe backend. Su objetivo es
// evitar guardar el texto original. La autenticación segura se
// implementará en el servidor en la siguiente experiencia.
export function ofuscarContrasena(texto) {
  let hash = 5381;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 33) ^ texto.charCodeAt(i);
  }
  return `h$${(hash >>> 0).toString(16)}`;
}
