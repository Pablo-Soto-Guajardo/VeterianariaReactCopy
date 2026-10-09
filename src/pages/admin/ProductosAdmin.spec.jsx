import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { obtenerProducto } from "../../data/baseDatos";
import { renderConRouter } from "../../test/utilidades";
import ProductosAdmin from "./ProductosAdmin";

describe("Administración de productos", () => {
  it("elimina un producto después de confirmar en el modal", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<ProductosAdmin />);
    expect(screen.getByText("16 productos en inventario")).toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Eliminar Nexgard (Afoxolaner)" }));
    const modal = await screen.findByRole("dialog");
    await usuario.click(within(modal).getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText("15 productos en inventario")).toBeInTheDocument();
    expect(obtenerProducto("ME004")).toBeNull();
  });

  it("filtra la tabla por texto", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<ProductosAdmin />);
    await usuario.type(screen.getByLabelText("Buscar"), "ME00");
    expect(screen.getAllByRole("row")).toHaveLength(8);
  });
});
