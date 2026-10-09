import { screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { listarProductos } from "../../data/baseDatos";
import { renderConRouter } from "../../test/utilidades";
import GrillaProductos from "./GrillaProductos";

describe("GrillaProductos", () => {
  it("renderiza una tarjeta por cada producto del arreglo recibido", () => {
    const productos = listarProductos();
    renderConRouter(<GrillaProductos productos={productos} onAgregar={vi.fn()} />);
    const tarjetas = screen.getAllByRole("article");
    expect(tarjetas).toHaveLength(productos.length);
    expect(within(tarjetas[0]).getByRole("heading")).toHaveTextContent(productos[0].nombre);
  });

  it("no muestra tarjetas cuando el arreglo está vacío", () => {
    renderConRouter(<GrillaProductos productos={[]} onAgregar={vi.fn()} />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
