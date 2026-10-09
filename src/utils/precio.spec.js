import { formatearPrecio, porcentajeDescuento, precioVigente, tieneOferta } from "./precio";

describe("utilidades de precio", () => {
  it("muestra el precio cero como Gratis", () => {
    expect(formatearPrecio(0)).toBe("Gratis");
  });

  it("formatea un valor positivo con separador de miles chileno", () => {
    expect(formatearPrecio(18900)).toBe("$18.900");
  });

  it("usa el precio de oferta solo cuando es menor que el precio normal", () => {
    expect(precioVigente({ precio: 18900, precioOferta: 16900 })).toBe(16900);
    expect(precioVigente({ precio: 18900, precioOferta: null })).toBe(18900);
    expect(tieneOferta({ precio: 5000, precioOferta: 6000 })).toBe(false);
  });

  it("calcula el porcentaje de descuento redondeado", () => {
    expect(porcentajeDescuento({ precio: 22000, precioOferta: 19800 })).toBe(10);
    expect(porcentajeDescuento({ precio: 0, precioOferta: null })).toBe(0);
  });
});
