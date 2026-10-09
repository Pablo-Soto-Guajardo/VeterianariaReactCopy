// Pasarela de pago simulada. En la siguiente experiencia se reemplazará por
// una llamada al backend; por eso devuelve una promesa, igual que una API real.

// Tarjetas de prueba documentadas en el formulario de pago.
export const TARJETA_APROBADA = "4111111111111111";
export const TARJETA_RECHAZADA = "4000000000000002";

export const DEMORA_PAGO_MS = 900;

export function procesarPago({ numeroTarjeta, total }) {
  const numero = numeroTarjeta.replace(/\s/g, "");
  return new Promise((resolver) => {
    setTimeout(() => {
      if (numero === TARJETA_RECHAZADA) {
        resolver({ aprobado: false, motivo: "Tarjeta rechazada por el emisor." });
        return;
      }
      resolver({
        aprobado: true,
        total,
        codigoAutorizacion: `AUT-${String(Date.now()).slice(-6)}`
      });
    }, DEMORA_PAGO_MS);
  });
}
