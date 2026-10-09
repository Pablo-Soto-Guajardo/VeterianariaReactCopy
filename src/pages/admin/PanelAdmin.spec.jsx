import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { obtenerUsuario } from "../../data/baseDatos";
import { iniciarSesionComoAdmin } from "../../test/sesiones";
import { CLAVE_SESION } from "../../utils/persistencia";

function renderAdmin(ruta) {
  iniciarSesionComoAdmin();
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("Panel de administración: cada vista renderiza sus datos", () => {
  it.each([
    ["/admin", "¡Hola, Administrador!"],
    ["/admin/ordenes", "Órdenes y boletas"],
    ["/admin/ordenes/1002", "Boleta #1002"],
    ["/admin/productos/ME005", "Bravecto (Fluralaner)"],
    ["/admin/productos/ME005/editar", "Editar producto"],
    ["/admin/productos/criticos", "Productos críticos"],
    ["/admin/productos/reportes", "Reporte de productos"],
    ["/admin/categorias", "Categorías"],
    ["/admin/usuarios/201234565", "Javiera Rojas Fuentes"],
    ["/admin/usuarios/201234565/compras", "Historial de compras"],
    ["/admin/reportes", "Reportes"],
    ["/admin/perfil", "Mi perfil"]
  ])("%s muestra el título «%s»", (ruta, titulo) => {
    renderAdmin(ruta);
    expect(screen.getByRole("heading", { level: 1, name: titulo })).toBeInTheDocument();
  });

  it("el dashboard resume compras, productos críticos y últimas órdenes", () => {
    renderAdmin("/admin");
    expect(screen.getByText("Total vendido: $50.480")).toBeInTheDocument();
    expect(screen.getByText("Hay 3 productos con stock crítico o agotado.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#1003" })).toBeInTheDocument();
  });

  it("filtra las órdenes por estado", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/ordenes");
    await usuario.selectOptions(screen.getByLabelText("Estado"), "Rechazada");
    const filas = within(screen.getByRole("table")).getAllByRole("row");
    expect(filas).toHaveLength(2);
    expect(filas[1]).toHaveTextContent("#1003");
  });

  it("muestra un mensaje cuando la orden o el producto no existen", () => {
    renderAdmin("/admin/ordenes/9999");
    expect(screen.getByText("La orden #9999 no existe")).toBeInTheDocument();
  });

  it("edita un producto y muestra el aviso de cambios guardados", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/productos/ME002/editar");
    const stock = screen.getByLabelText("Stock");
    await usuario.clear(stock);
    await usuario.type(stock, "30");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByRole("status")).toHaveTextContent("Cambios guardados correctamente.");
    expect(screen.getByText("Stock: 30 unidades")).toBeInTheDocument();
  });

  it("cerrar sesión elimina la sesión y vuelve al inicio de sesión", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin");
    await usuario.click(screen.getByRole("button", { name: /cerrar sesión/i }));
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("actualiza el perfil del administrador y su sesión", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/perfil");
    const nombre = screen.getByLabelText("Nombre");
    await usuario.clear(nombre);
    await usuario.type(nombre, "Pablo");
    await usuario.click(screen.getByRole("button", { name: "Guardar perfil" }));
    expect(screen.getByText("Tus datos fueron actualizados.")).toBeInTheDocument();
    expect(obtenerUsuario("190110222").nombre).toBe("Pablo");
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).nombre).toBe("Pablo");
  });
});
