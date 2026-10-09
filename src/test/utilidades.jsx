// Ayudas compartidas por las pruebas de componentes.
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

// Muestra la ruta actual para comprobar redirecciones.
export function RutaActual() {
  const ubicacion = useLocation();
  return <p data-testid="ruta-actual">{ubicacion.pathname}</p>;
}

// Renderiza un componente dentro de un router en memoria.
// rutaPatron permite usar parámetros como /productos/:codigo.
export function renderConRouter(elemento, { ruta = "/", rutaPatron = "*", otrasRutas = [] } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path={rutaPatron} element={elemento} />
        {otrasRutas.map((patron) => (
          <Route key={patron} path={patron} element={<RutaActual />} />
        ))}
      </Routes>
    </MemoryRouter>
  );
}

export const productoDePrueba = {
  codigo: "PR001",
  nombre: "Antiparasitario de prueba",
  categoria: "antiparasitarios",
  presentacion: "Caja 1 unid.",
  descripcion: "Producto usado solo en pruebas.",
  precio: 10000,
  precioOferta: null,
  stock: 20,
  stockCritico: 5,
  imagen: ""
};
