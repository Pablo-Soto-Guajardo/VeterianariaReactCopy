import { vi } from "vitest";
import { DEMORA_PAGO_MS, TARJETA_APROBADA, TARJETA_RECHAZADA, procesarPago } from "./pagos";

describe("pasarela de pago simulada (asíncrona)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("aprueba la tarjeta de prueba y entrega un código de autorización", async () => {
    const promesa = procesarPago({ numeroTarjeta: TARJETA_APROBADA, total: 21490 });
    await vi.advanceTimersByTimeAsync(DEMORA_PAGO_MS);
    const resultado = await promesa;
    expect(resultado.aprobado).toBe(true);
    expect(resultado.codigoAutorizacion).toMatch(/^AUT-\d{6}$/);
  });

  it("rechaza la tarjeta de prueba de rechazo aunque tenga espacios", async () => {
    const promesa = procesarPago({ numeroTarjeta: "4000 0000 0000 0002", total: 1000 });
    await vi.advanceTimersByTimeAsync(DEMORA_PAGO_MS);
    await expect(promesa).resolves.toEqual({ aprobado: false, motivo: "Tarjeta rechazada por el emisor." });
    expect(TARJETA_RECHAZADA).toBe("4000000000000002");
  });
});
