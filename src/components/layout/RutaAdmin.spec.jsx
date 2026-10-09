import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RutaActual } from "../../test/utilidades";
import RutaAdmin from "./RutaAdmin";

function renderRuta(sesion) {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<RutaAdmin sesion={sesion}><p>Contenido privado</p></RutaAdmin>} />
        <Route path="/login" element={<RutaActual />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RutaAdmin (ruta protegida)", () => {
  it("redirige a /login cuando no hay sesión", () => {
    renderRuta(null);
    expect(screen.getByTestId("ruta-actual")).toHaveTextContent("/login");
    expect(screen.queryByText("Contenido privado")).not.toBeInTheDocument();
  });

  it("bloquea a usuarios que no son administradores", () => {
    renderRuta({ nombre: "Javiera", rol: "Cliente" });
    expect(screen.getByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
  });

  it("muestra el contenido al administrador", () => {
    renderRuta({ nombre: "Admin", rol: "Administrador" });
    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });
});
