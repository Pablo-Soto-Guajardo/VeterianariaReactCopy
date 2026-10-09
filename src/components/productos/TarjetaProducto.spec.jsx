import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { productoDePrueba, renderConRouter } from "../../test/utilidades";
import TarjetaProducto from "./TarjetaProducto";

describe("TarjetaProducto", () => {
  it("renderiza el nombre, la categoría y el precio recibidos por props", () => {
    renderConRouter(<TarjetaProducto producto={productoDePrueba} nombreCategoria="Antiparasitarios" onAgregar={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Antiparasitario de prueba" })).toBeInTheDocument();
    expect(screen.getByText("Antiparasitarios")).toBeInTheDocument();
    expect(screen.getByText("$10.000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Antiparasitario de prueba" })).toHaveAttribute("href", "/productos/PR001");
  });

  it("muestra el precio anterior y el descuento solo cuando hay oferta", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoDePrueba, precioOferta: 8000 }} onAgregar={vi.fn()} />);
    expect(screen.getByText("$8.000")).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument();
  });

  it("muestra el aviso de últimas unidades cuando el stock es crítico", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoDePrueba, stock: 3 }} onAgregar={vi.fn()} />);
    expect(screen.getByText(/últimas 3 unidades/i)).toBeInTheDocument();
  });

  it("deshabilita el botón cuando el producto está agotado", () => {
    renderConRouter(<TarjetaProducto producto={{ ...productoDePrueba, stock: 0 }} onAgregar={vi.fn()} />);
    expect(screen.getByRole("button", { name: /sin stock/i })).toBeDisabled();
    expect(screen.getByText("Agotado temporalmente")).toBeInTheDocument();
  });

  it("ejecuta onAgregar con el producto al presionar el botón (vi.fn)", async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();
    renderConRouter(<TarjetaProducto producto={productoDePrueba} onAgregar={onAgregar} />);
    await usuario.click(screen.getByRole("button", { name: "Añadir Antiparasitario de prueba al carrito" }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(productoDePrueba);
  });
});
