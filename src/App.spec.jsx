import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { CLAVE_CARRITO } from "./utils/persistencia";

function renderApp(ruta = "/") {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("App (integración de rutas y estado global)", () => {
  it("al agregar un producto actualiza el carrito del encabezado y lo persiste", async () => {
    const usuario = userEvent.setup();
    renderApp("/ofertas");
    await usuario.click(screen.getByRole("button", { name: "Añadir Bravecto (Fluralaner) al carrito" }));
    expect(screen.getByRole("link", { name: /Carrito: 1 productos, total \$16\.900/ })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([{ codigo: "ME005", cantidad: 1 }]);
    expect(await screen.findByText('"Bravecto (Fluralaner)" se agregó al carrito.')).toBeInTheDocument();
  });

  it("recupera el carrito guardado al volver a abrir la aplicación", () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ codigo: "ME004", cantidad: 3 }]));
    renderApp("/carrito");
    expect(screen.getByTestId("total-carrito")).toHaveTextContent("$28.500");
  });

  it("muestra la página 404 para rutas desconocidas", () => {
    renderApp("/no-existe");
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
  });

  it("registra un usuario nuevo e inicia su sesión", async () => {
    const usuario = userEvent.setup();
    renderApp("/registro");
    const formulario = screen.getByRole("form", { name: "Formulario de usuario" });
    await usuario.type(within(formulario).getByLabelText("RUN (sin puntos ni guion)"), "176543213");
    await usuario.type(within(formulario).getByLabelText("Nombre"), "Pedro");
    await usuario.type(within(formulario).getByLabelText("Apellidos"), "Soto");
    await usuario.type(within(formulario).getByLabelText("Correo electrónico"), "pedro@gmail.com");
    await usuario.type(within(formulario).getByLabelText("Dirección"), "Calle 2");
    await usuario.selectOptions(within(formulario).getByLabelText("Región"), "RM");
    await usuario.selectOptions(within(formulario).getByLabelText("Comuna"), "Maipú");
    await usuario.type(within(formulario).getByLabelText(/^Contraseña/), "pedro1");
    await usuario.type(within(formulario).getByLabelText("Confirmar contraseña"), "pedro1");
    await usuario.click(within(formulario).getByRole("button", { name: "Registrarme" }));
    expect(screen.getByRole("heading", { name: "¡Bienvenido/a, Pedro!" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hola, Pedro/ })).toBeInTheDocument();
  });

  it("en el carrito, + y − cambian la cantidad y la papelera quita el producto", async () => {
    const usuario = userEvent.setup();
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ codigo: "ME004", cantidad: 1 }, { codigo: "HI002", cantidad: 1 }]));
    renderApp("/carrito");
    await usuario.click(screen.getByRole("button", { name: "Agregar una unidad de Nexgard (Afoxolaner)" }));
    expect(screen.getByTestId("total-carrito")).toHaveTextContent("$25.500");
    await usuario.click(screen.getByRole("button", { name: "Quitar una unidad de Limpiador ótico" }));
    expect(screen.queryByText("Limpiador ótico", { selector: "a" })).not.toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Eliminar Nexgard (Afoxolaner) del carrito" }));
    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]);
  });

  it("avisa con un error cuando se intenta superar el stock disponible", async () => {
    const usuario = userEvent.setup();
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ codigo: "ME002", cantidad: 4 }]));
    renderApp("/productos/ME002");
    await usuario.click(screen.getByRole("button", { name: /añadir al carrito/i }));
    expect(await screen.findByText("No puedes superar el stock disponible (4 unidades).")).toBeInTheDocument();
  });
});

