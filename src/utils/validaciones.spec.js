import {
  calcularDigitoVerificador,
  validarCheckout,
  validarContrasena,
  validarCorreo,
  validarFechaNacimiento,
  validarProducto,
  validarRun,
  validarUsuario
} from "./validaciones";

const usuarioValido = {
  run: "201234565",
  nombre: "Javiera",
  apellidos: "Rojas Fuentes",
  correo: "javiera@gmail.com",
  direccion: "Los Crisantemos 120",
  region: "RM",
  comuna: "Providencia",
  fechaNacimiento: "",
  contrasena: "clave1",
  confirmarContrasena: "clave1"
};

describe("validarRun", () => {
  it("acepta un RUN con dígito verificador correcto", () => {
    expect(calcularDigitoVerificador("19011022")).toBe("2");
    expect(validarRun("190110222")).toBe("");
  });

  it("rechaza un RUN con dígito verificador incorrecto", () => {
    expect(validarRun("19011022K")).toBe("El dígito verificador del RUN no es correcto");
  });

  it("rechaza formatos con puntos o guion y el campo vacío", () => {
    expect(validarRun("19.011.022-2")).toMatch(/sin puntos ni guion/);
    expect(validarRun("")).toBe("El RUN es obligatorio");
  });
});

describe("validarCorreo y validarContrasena", () => {
  it("solo acepta los dominios permitidos por el negocio", () => {
    expect(validarCorreo("persona@duoc.cl")).toBe("");
    expect(validarCorreo("profe@profesor.duoc.cl")).toBe("");
    expect(validarCorreo("persona@hotmail.com")).toMatch(/Solo se aceptan/);
  });

  it("exige una contraseña de 4 a 10 caracteres", () => {
    expect(validarContrasena("abc")).toMatch(/entre 4 y 10/);
    expect(validarContrasena("abcd")).toBe("");
    expect(validarContrasena("abcdefghijk")).toMatch(/entre 4 y 10/);
  });

  it("no permite fechas de nacimiento futuras", () => {
    const hoy = new Date("2026-10-08T12:00:00");
    expect(validarFechaNacimiento("2030-01-01", hoy)).toMatch(/no puede ser futura/);
    expect(validarFechaNacimiento("2000-01-01", hoy)).toBe("");
    expect(validarFechaNacimiento("", hoy)).toBe("");
  });
});

describe("validaciones de formularios completos", () => {
  it("un usuario válido no tiene errores", () => {
    expect(validarUsuario(usuarioValido)).toEqual({});
  });

  it("detecta contraseñas que no coinciden y rol faltante", () => {
    const errores = validarUsuario(
      { ...usuarioValido, confirmarContrasena: "otra", rol: "" },
      { validarRol: true }
    );
    expect(errores.confirmarContrasena).toBe("Las contraseñas no coinciden");
    expect(errores.rol).toBe("Selecciona un rol");
  });

  it("al editar permite dejar la contraseña vacía", () => {
    const errores = validarUsuario(
      { ...usuarioValido, contrasena: "", confirmarContrasena: "" },
      { requiereContrasena: false }
    );
    expect(errores).toEqual({});
  });

  it("rechaza una oferta mayor o igual al precio normal", () => {
    const producto = {
      codigo: "ME020",
      nombre: "Producto",
      descripcion: "",
      precio: "5000",
      precioOferta: "5000",
      stock: "3",
      stockCritico: "",
      categoria: "higiene"
    };
    expect(validarProducto(producto).precioOferta).toBe("La oferta debe ser menor que el precio normal");
    expect(validarProducto({ ...producto, precioOferta: "4500" })).toEqual({});
  });

  it("exige una tarjeta de 16 dígitos en el checkout", () => {
    const errores = validarCheckout({
      nombre: "Ana",
      apellidos: "Pérez",
      correo: "ana@gmail.com",
      calle: "Calle 1",
      region: "RM",
      comuna: "Santiago",
      indicaciones: "",
      tarjeta: "4111 1111"
    });
    expect(errores).toEqual({ tarjeta: "La tarjeta debe tener 16 dígitos" });
  });
});
