import {
  CLAVES,
  actualizarProducto,
  autenticarUsuario,
  crearCategoria,
  crearOrden,
  crearProducto,
  crearUsuario,
  descontarStock,
  eliminarCategoria,
  eliminarProducto,
  eliminarUsuario,
  listarProductos,
  listarProductosCriticos,
  obtenerProducto,
  reiniciarBaseDatos
} from "./baseDatos";

const nuevoProducto = {
  codigo: "me020",
  nombre: "Producto nuevo",
  categoria: "higiene",
  presentacion: "",
  descripcion: "",
  precio: "4990",
  precioOferta: "",
  stock: "10",
  stockCritico: "2",
  imagen: ""
};

describe("base de datos simulada: productos (CRUD)", () => {
  it("carga los datos iniciales la primera vez que se lee", () => {
    expect(localStorage.getItem(CLAVES.productos)).toBeNull();
    const productos = listarProductos();
    expect(productos.length).toBeGreaterThan(10);
    expect(localStorage.getItem(CLAVES.productos)).not.toBeNull();
  });

  it("crea un producto normalizando código y números", () => {
    const creado = crearProducto(nuevoProducto);
    expect(creado.codigo).toBe("ME020");
    expect(creado.precio).toBe(4990);
    expect(creado.precioOferta).toBeNull();
    expect(obtenerProducto("ME020")).toEqual(creado);
  });

  it("no permite códigos repetidos", () => {
    expect(() => crearProducto({ ...nuevoProducto, codigo: "ME004" })).toThrow("Ya existe un producto con el código ME004.");
  });

  it("actualiza un producto sin cambiar su código y lo elimina", () => {
    const actualizado = actualizarProducto("ME004", { codigo: "OTRO", stock: "5" });
    expect(actualizado.codigo).toBe("ME004");
    expect(actualizado.stock).toBe(5);
    eliminarProducto("ME004");
    expect(obtenerProducto("ME004")).toBeNull();
    expect(() => eliminarProducto("ME004")).toThrow(/No existe/);
  });

  it("lista como críticos los productos con stock menor o igual al crítico", () => {
    const codigos = listarProductosCriticos().map((producto) => producto.codigo);
    expect(codigos).toEqual(expect.arrayContaining(["ME005", "ME002", "ME011"]));
    expect(codigos).not.toContain("ME004");
  });

  it("descuenta stock y rechaza compras que superan el disponible", () => {
    descontarStock([{ codigo: "ME004", nombre: "Nexgard", cantidad: 10 }]);
    expect(obtenerProducto("ME004").stock).toBe(50);
    expect(() => descontarStock([{ codigo: "ME011", nombre: "Clorhexidina", cantidad: 1 }])).toThrow(/Stock insuficiente/);
  });
});

describe("base de datos simulada: categorías, usuarios y órdenes", () => {
  it("crea una categoría con identificador para URL y evita eliminar categorías en uso", () => {
    expect(crearCategoria({ nombre: "Juguetes y Accesorios", descripcion: "" }).id).toBe("juguetes-y-accesorios");
    expect(() => eliminarCategoria("antiparasitarios")).toThrow(/No se puede eliminar/);
  });

  it("registra usuarios sin guardar la contraseña original y los autentica", () => {
    const usuario = crearUsuario({
      run: "213456784",
      nombre: "Ana",
      apellidos: "Pérez",
      correo: "ANA@gmail.com",
      contrasena: "clave1",
      direccion: "Calle 1",
      region: "RM",
      comuna: "Santiago"
    });
    expect(usuario.correo).toBe("ana@gmail.com");
    expect(usuario).not.toHaveProperty("contrasena");
    expect(localStorage.getItem(CLAVES.usuarios)).not.toContain("clave1");
    expect(autenticarUsuario("ana@gmail.com", "clave1").rol).toBe("Cliente");
    expect(autenticarUsuario("ana@gmail.com", "incorrecta")).toBeNull();
  });

  it("no permite RUN repetido ni eliminar al único administrador", () => {
    expect(() =>
      crearUsuario({ run: "190110222", correo: "otro@gmail.com", nombre: "X", apellidos: "Y", contrasena: "1234", direccion: "Z", region: "RM", comuna: "Santiago" })
    ).toThrow("Ya existe un usuario registrado con ese RUN.");
    expect(() => eliminarUsuario("190110222")).toThrow("No se puede eliminar al único administrador.");
  });

  it("asigna números de orden correlativos", () => {
    const orden = crearOrden({ estado: "Pagada", cliente: {}, envio: {}, items: [], total: 0, pago: {} });
    expect(orden.numero).toBe(1004);
  });

  it("reinicia la base de datos a los datos de ejemplo", () => {
    eliminarProducto("ME004");
    reiniciarBaseDatos();
    expect(obtenerProducto("ME004")).not.toBeNull();
  });
});
