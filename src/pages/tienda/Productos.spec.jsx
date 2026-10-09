import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderConRouter } from "../../test/utilidades";
import Productos from "./Productos";

describe("Página Productos: filtros de búsqueda", () => {
  it("filtra el catálogo al escribir en el buscador", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Productos onAgregar={vi.fn()} />, { ruta: "/productos" });
    expect(screen.getByRole("status")).toHaveTextContent("16 productos encontrados");
    await usuario.type(screen.getByLabelText("Buscar"), "bravecto");
    expect(screen.getByRole("status")).toHaveTextContent("1 producto encontrado");
    expect(screen.getByRole("heading", { name: "Bravecto (Fluralaner)" })).toBeInTheDocument();
  });

  it("combina categoría y solo con stock, y muestra un mensaje si no hay resultados", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Productos onAgregar={vi.fn()} />, { ruta: "/productos" });
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "dermatologia");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await usuario.click(screen.getByLabelText("Solo con stock"));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    await usuario.type(screen.getByLabelText("Buscar"), "zzz");
    expect(screen.getByText("No encontramos productos")).toBeInTheDocument();
  });

  it("lee la búsqueda enviada desde el encabezado en la URL", () => {
    renderConRouter(<Productos onAgregar={vi.fn()} />, { ruta: "/productos?buscar=dieta" });
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});
