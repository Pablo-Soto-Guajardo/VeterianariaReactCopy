import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { obtenerOrden, obtenerProducto } from "../../data/baseDatos";
import { procesarPago } from "../../services/pagos";
import { renderConRouter } from "../../test/utilidades";
import Checkout from "./Checkout";

// Mock del servicio de pago: la prueba controla la respuesta sin esperar ni usar red.
vi.mock("../../services/pagos", () => ({
  TARJETA_APROBADA: "4111111111111111",
  TARJETA_RECHAZADA: "4000000000000002",
  procesarPago: vi.fn()
}));

const sesion = {
  run: "201234565",
  nombre: "Javiera",
  apellidos: "Rojas Fuentes",
  correo: "cliente@gmail.com",
  direccion: "Los Crisantemos 120",
  region: "RM",
  comuna: "Providencia",
  rol: "Cliente"
};
const carrito = [{ codigo: "ME004", cantidad: 2 }];

function renderCheckout(onCompraExitosa = vi.fn()) {
  renderConRouter(<Checkout carrito={carrito} sesion={sesion} onCompraExitosa={onCompraExitosa} />, {
    ruta: "/checkout",
    rutaPatron: "/checkout",
    otrasRutas: ["/compra/exitosa/:numero", "/compra/error/:numero"]
  });
}

describe("Página Checkout", () => {
  beforeEach(() => vi.mocked(procesarPago).mockReset());

  it("completa automáticamente los datos del cliente con la sesión", () => {
    renderCheckout();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Javiera");
    expect(screen.getByLabelText("Comuna")).toHaveValue("Providencia");
    expect(screen.getByRole("button", { name: "Pagar ahora $19.000" })).toBeInTheDocument();
  });

  it("no llama al servicio de pago si faltan datos", async () => {
    const usuario = userEvent.setup();
    renderCheckout();
    await usuario.click(screen.getByRole("button", { name: /pagar ahora/i }));
    expect(screen.getByText("El número de tarjeta es obligatorio")).toBeInTheDocument();
    expect(procesarPago).not.toHaveBeenCalled();
  });

  it("con pago aprobado guarda la orden, descuenta stock y redirige a compra exitosa", async () => {
    vi.mocked(procesarPago).mockResolvedValue({ aprobado: true, codigoAutorizacion: "AUT-123456" });
    const usuario = userEvent.setup();
    const onCompraExitosa = vi.fn();
    renderCheckout(onCompraExitosa);
    await usuario.type(screen.getByLabelText("Número de tarjeta"), "4111111111111111");
    await usuario.click(screen.getByRole("button", { name: /pagar ahora/i }));

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/compra/exitosa/1004");
    expect(procesarPago).toHaveBeenCalledWith({ numeroTarjeta: "4111111111111111", total: 19000 });
    expect(onCompraExitosa).toHaveBeenCalled();
    expect(obtenerOrden(1004)).toMatchObject({ estado: "Pagada", total: 19000 });
    expect(obtenerProducto("ME004").stock).toBe(58);
  });

  it("con pago rechazado guarda la orden rechazada y no vacía el carrito", async () => {
    vi.mocked(procesarPago).mockResolvedValue({ aprobado: false, motivo: "Tarjeta rechazada por el emisor." });
    const usuario = userEvent.setup();
    const onCompraExitosa = vi.fn();
    renderCheckout(onCompraExitosa);
    await usuario.type(screen.getByLabelText("Número de tarjeta"), "4000000000000002");
    await usuario.click(screen.getByRole("button", { name: /pagar ahora/i }));

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/compra/error/1004");
    expect(onCompraExitosa).not.toHaveBeenCalled();
    expect(obtenerOrden(1004).pago.motivo).toBe("Tarjeta rechazada por el emisor.");
    expect(obtenerProducto("ME004").stock).toBe(60);
  });

  it("si el stock se agotó antes de pagar, la orden queda rechazada aunque el banco apruebe", async () => {
    vi.mocked(procesarPago).mockResolvedValue({ aprobado: true, codigoAutorizacion: "AUT-000001" });
    localStorage.setItem("sanMarcos.productos", JSON.stringify([{ ...obtenerProducto("ME004"), stock: 1 }]));
    const usuario = userEvent.setup();
    renderCheckout();
    await usuario.type(screen.getByLabelText("Número de tarjeta"), "4111111111111111");
    await usuario.click(screen.getByRole("button", { name: /pagar ahora/i }));
    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/compra/error/1004");
    expect(obtenerOrden(1004).pago.motivo).toBe("Stock insuficiente para Nexgard (Afoxolaner).");
  });

  it("muestra un mensaje si se entra al checkout con el carrito vacío", () => {
    renderConRouter(<Checkout carrito={[]} sesion={null} onCompraExitosa={vi.fn()} />);
    expect(screen.getByText("No hay productos para pagar")).toBeInTheDocument();
  });
});

