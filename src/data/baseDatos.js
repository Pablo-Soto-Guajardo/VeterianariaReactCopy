// Base de datos simulada de Veterinaria San Marcos.
// Cada colección se guarda en localStorage y se administra con funciones CRUD
// (Crear, Leer, Actualizar, Eliminar). Los componentes React nunca usan
// localStorage directamente: siempre llaman a estas funciones.
import {
  categoriasIniciales,
  ordenesIniciales,
  productosIniciales,
  usuariosIniciales
} from "./datosIniciales";
import { guardarDatos, leerDatos } from "../utils/almacenamiento";
import { ofuscarContrasena } from "../utils/seguridad";
import { crearSlug } from "../utils/texto";

export const CLAVES = {
  productos: "sanMarcos.productos",
  categorias: "sanMarcos.categorias",
  usuarios: "sanMarcos.usuarios",
  ordenes: "sanMarcos.ordenes",
  mensajes: "sanMarcos.mensajes"
};

const INICIALES = {
  productos: productosIniciales,
  categorias: categoriasIniciales,
  usuarios: usuariosIniciales,
  ordenes: ordenesIniciales,
  mensajes: []
};

// Lee una colección. Si todavía no existe, la crea con sus datos iniciales.
function leerColeccion(nombre) {
  const datos = leerDatos(CLAVES[nombre], null);
  if (datos === null) {
    guardarDatos(CLAVES[nombre], INICIALES[nombre]);
    return JSON.parse(JSON.stringify(INICIALES[nombre]));
  }
  return datos;
}

function guardarColeccion(nombre, datos) {
  guardarDatos(CLAVES[nombre], datos);
}

// Vuelve a cargar los datos de ejemplo (útil para demostraciones).
export function reiniciarBaseDatos() {
  for (const nombre of Object.keys(CLAVES)) {
    guardarDatos(CLAVES[nombre], INICIALES[nombre]);
  }
}

/* ===================== PRODUCTOS ===================== */

export function listarProductos() {
  return leerColeccion("productos");
}

export function obtenerProducto(codigo) {
  return listarProductos().find((producto) => producto.codigo === codigo) || null;
}

function normalizarProducto(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    presentacion: (datos.presentacion || "").trim(),
    descripcion: (datos.descripcion || "").trim(),
    precio: Number(datos.precio),
    precioOferta:
      datos.precioOferta === "" || datos.precioOferta === null || datos.precioOferta === undefined
        ? null
        : Number(datos.precioOferta),
    stock: Number(datos.stock),
    stockCritico: datos.stockCritico === "" ? 0 : Number(datos.stockCritico),
    imagen: (datos.imagen || "").trim()
  };
}

export function crearProducto(datos) {
  const productos = listarProductos();
  const nuevo = normalizarProducto(datos);
  if (productos.some((producto) => producto.codigo === nuevo.codigo)) {
    throw new Error(`Ya existe un producto con el código ${nuevo.codigo}.`);
  }
  guardarColeccion("productos", [...productos, nuevo]);
  return nuevo;
}

export function actualizarProducto(codigo, datos) {
  const productos = listarProductos();
  const indice = productos.findIndex((producto) => producto.codigo === codigo);
  if (indice === -1) throw new Error(`No existe el producto ${codigo}.`);
  // El código identifica al producto y no se modifica.
  const actualizado = { ...normalizarProducto({ ...productos[indice], ...datos }), codigo };
  const copia = [...productos];
  copia[indice] = actualizado;
  guardarColeccion("productos", copia);
  return actualizado;
}

export function eliminarProducto(codigo) {
  const productos = listarProductos();
  if (!productos.some((producto) => producto.codigo === codigo)) {
    throw new Error(`No existe el producto ${codigo}.`);
  }
  guardarColeccion(
    "productos",
    productos.filter((producto) => producto.codigo !== codigo)
  );
}

export function listarProductosCriticos() {
  return listarProductos().filter((producto) => producto.stock <= producto.stockCritico);
}

export function listarProductosEnOferta() {
  return listarProductos().filter(
    (producto) => producto.precioOferta !== null && producto.precioOferta < producto.precio
  );
}

export function listarProductosPorCategoria(idCategoria) {
  return listarProductos().filter((producto) => producto.categoria === idCategoria);
}

// Descuenta el stock de los productos comprados. Falla si alguno no alcanza.
export function descontarStock(items) {
  const productos = listarProductos();
  for (const item of items) {
    const producto = productos.find((p) => p.codigo === item.codigo);
    if (!producto || producto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${item.nombre}.`);
    }
  }
  const actualizados = productos.map((producto) => {
    const item = items.find((i) => i.codigo === producto.codigo);
    return item ? { ...producto, stock: producto.stock - item.cantidad } : producto;
  });
  guardarColeccion("productos", actualizados);
}

/* ===================== CATEGORÍAS ===================== */

export function listarCategorias() {
  return leerColeccion("categorias");
}

export function obtenerCategoria(id) {
  return listarCategorias().find((categoria) => categoria.id === id) || null;
}

export function crearCategoria(datos) {
  const categorias = listarCategorias();
  const nueva = {
    id: crearSlug(datos.nombre),
    nombre: datos.nombre.trim(),
    descripcion: (datos.descripcion || "").trim(),
    imagen: (datos.imagen || "").trim()
  };
  if (categorias.some((categoria) => categoria.id === nueva.id)) {
    throw new Error(`Ya existe la categoría ${nueva.nombre}.`);
  }
  guardarColeccion("categorias", [...categorias, nueva]);
  return nueva;
}

export function actualizarCategoria(id, datos) {
  const categorias = listarCategorias();
  const indice = categorias.findIndex((categoria) => categoria.id === id);
  if (indice === -1) throw new Error("La categoría no existe.");
  const actualizada = {
    ...categorias[indice],
    nombre: datos.nombre.trim(),
    descripcion: (datos.descripcion || "").trim(),
    imagen: (datos.imagen || "").trim()
  };
  const copia = [...categorias];
  copia[indice] = actualizada;
  guardarColeccion("categorias", copia);
  return actualizada;
}

export function eliminarCategoria(id) {
  const enUso = listarProductos().filter((producto) => producto.categoria === id).length;
  if (enUso > 0) {
    throw new Error(`No se puede eliminar: ${enUso} producto(s) usan esta categoría.`);
  }
  guardarColeccion(
    "categorias",
    listarCategorias().filter((categoria) => categoria.id !== id)
  );
}

/* ===================== USUARIOS ===================== */

// Devuelve una copia del usuario sin la contraseña ofuscada.
function sinContrasena(usuario) {
  if (!usuario) return null;
  const { contrasena: _contrasena, ...publico } = usuario;
  return publico;
}

function leerUsuarios() {
  return leerColeccion("usuarios");
}

export function listarUsuarios() {
  return leerUsuarios().map(sinContrasena);
}

export function obtenerUsuario(run) {
  return sinContrasena(leerUsuarios().find((usuario) => usuario.run === run));
}

export function obtenerUsuarioPorCorreo(correo) {
  const buscado = correo.trim().toLowerCase();
  return sinContrasena(leerUsuarios().find((usuario) => usuario.correo === buscado));
}

export function crearUsuario(datos) {
  const usuarios = leerUsuarios();
  const run = datos.run.trim().toUpperCase();
  const correo = datos.correo.trim().toLowerCase();
  if (usuarios.some((usuario) => usuario.run === run)) {
    throw new Error("Ya existe un usuario registrado con ese RUN.");
  }
  if (usuarios.some((usuario) => usuario.correo === correo)) {
    throw new Error("Ya existe un usuario registrado con ese correo.");
  }
  const nuevo = {
    run,
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo,
    contrasena: ofuscarContrasena(datos.contrasena),
    rol: datos.rol || "Cliente",
    fechaNacimiento: datos.fechaNacimiento || "",
    direccion: datos.direccion.trim(),
    region: datos.region,
    comuna: datos.comuna
  };
  guardarColeccion("usuarios", [...usuarios, nuevo]);
  return sinContrasena(nuevo);
}

export function actualizarUsuario(run, datos) {
  const usuarios = leerUsuarios();
  const indice = usuarios.findIndex((usuario) => usuario.run === run);
  if (indice === -1) throw new Error("El usuario no existe.");
  const correo = datos.correo.trim().toLowerCase();
  if (usuarios.some((usuario) => usuario.correo === correo && usuario.run !== run)) {
    throw new Error("Ese correo ya está en uso por otro usuario.");
  }
  const actual = usuarios[indice];
  const actualizado = {
    ...actual,
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo,
    rol: datos.rol || actual.rol,
    fechaNacimiento: datos.fechaNacimiento || "",
    direccion: datos.direccion.trim(),
    region: datos.region,
    comuna: datos.comuna,
    // Si no se escribe una nueva contraseña, se conserva la anterior.
    contrasena: datos.contrasena ? ofuscarContrasena(datos.contrasena) : actual.contrasena
  };
  const copia = [...usuarios];
  copia[indice] = actualizado;
  guardarColeccion("usuarios", copia);
  return sinContrasena(actualizado);
}

export function eliminarUsuario(run) {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.run === run);
  if (!usuario) throw new Error("El usuario no existe.");
  const administradores = usuarios.filter((u) => u.rol === "Administrador");
  if (usuario.rol === "Administrador" && administradores.length === 1) {
    throw new Error("No se puede eliminar al único administrador.");
  }
  guardarColeccion(
    "usuarios",
    usuarios.filter((u) => u.run !== run)
  );
}

// Devuelve el usuario si el correo y la contraseña coinciden; si no, null.
export function autenticarUsuario(correo, contrasena) {
  const buscado = correo.trim().toLowerCase();
  const usuario = leerUsuarios().find(
    (u) => u.correo === buscado && u.contrasena === ofuscarContrasena(contrasena)
  );
  return sinContrasena(usuario);
}

/* ===================== ÓRDENES ===================== */

export function listarOrdenes() {
  return leerColeccion("ordenes").sort((a, b) => b.numero - a.numero);
}

export function obtenerOrden(numero) {
  return listarOrdenes().find((orden) => orden.numero === Number(numero)) || null;
}

export function listarOrdenesDeUsuario(correo) {
  return listarOrdenes().filter((orden) => orden.cliente.correo === correo);
}

export function crearOrden(datos) {
  const ordenes = leerColeccion("ordenes");
  const numero = ordenes.reduce((mayor, orden) => Math.max(mayor, orden.numero), 1000) + 1;
  const nueva = {
    numero,
    fecha: new Date().toISOString(),
    estado: datos.estado,
    cliente: datos.cliente,
    envio: datos.envio,
    items: datos.items.map((item) => ({
      codigo: item.codigo,
      nombre: item.nombre,
      precioUnitario: item.precioUnitario,
      cantidad: item.cantidad,
      imagen: item.imagen
    })),
    total: datos.total,
    pago: datos.pago
  };
  guardarColeccion("ordenes", [...ordenes, nueva]);
  return nueva;
}

/* ===================== MENSAJES DE CONTACTO ===================== */

export function crearMensajeContacto(datos) {
  const mensajes = leerColeccion("mensajes");
  const nuevo = {
    id: mensajes.length + 1,
    fecha: new Date().toISOString(),
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    comentario: datos.comentario.trim()
  };
  guardarColeccion("mensajes", [...mensajes, nuevo]);
  return nuevo;
}

export function listarMensajesContacto() {
  return leerColeccion("mensajes");
}
