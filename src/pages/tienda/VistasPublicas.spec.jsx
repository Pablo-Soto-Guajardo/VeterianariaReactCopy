import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";

function renderApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("Vistas públicas de la tienda", () => {
  it.each([
    ["/categorias", "Categorías"],
    ["/categorias/antibioticos", "Antibióticos"],
    ["/ofertas", "Ofertas"],
    ["/nosotros", "Sobre Veterinaria San Marcos"],
    ["/blogs", "Noticias importantes"],
    ["/blogs/2", "Manejo de alergias cutáneas en felinos"]
  ])("%s muestra el título «%s»", (ruta, titulo) => {
    renderApp(ruta);
    expect(screen.getByRole("heading", { level: 1, name: titulo })).toBeInTheDocument();
  });

  it("la portada muestra las categorías y las ofertas destacadas", () => {
    renderApp("/");
    expect(screen.getByRole("heading", { name: "Categorías" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ofertas destacadas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Antiparasitarios" })).toHaveAttribute("href", "/categorias/antiparasitarios");
  });

  it("la categoría muestra solo sus productos", () => {
    renderApp("/categorias/antibioticos");
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("muestra mensajes cuando la categoría o el artículo no existen", () => {
    renderApp("/blogs/99");
    expect(screen.getByText("El artículo solicitado no existe")).toBeInTheDocument();
  });

  it("la búsqueda del encabezado lleva al catálogo filtrado", async () => {
    const usuario = userEvent.setup();
    renderApp("/");
    await usuario.type(screen.getByRole("searchbox", { name: "Buscar productos" }), "apoquel");
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));
    expect(screen.getByRole("heading", { level: 1, name: "Productos" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("valida el correo del newsletter en el pie de página", async () => {
    const usuario = userEvent.setup();
    renderApp("/nosotros");
    await usuario.type(screen.getByLabelText("Recibe consejos y ofertas en tu correo"), "malo@yahoo.com");
    await usuario.click(screen.getByRole("button", { name: "Suscribirme" }));
    expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument();
    await usuario.clear(screen.getByLabelText("Recibe consejos y ofertas en tu correo"));
    await usuario.type(screen.getByLabelText("Recibe consejos y ofertas en tu correo"), "bien@gmail.com");
    await usuario.click(screen.getByRole("button", { name: "Suscribirme" }));
    expect(screen.getByText(/Gracias/)).toBeInTheDocument();
  });

  it("un cliente no puede entrar al panel de administración", () => {
    localStorage.setItem("sanMarcos.sesion", JSON.stringify({ nombre: "Javiera", rol: "Cliente", correo: "cliente@gmail.com" }));
    renderApp("/admin");
    expect(screen.getByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
  });
});
