import { fireEvent, render, screen } from "@testing-library/react";
import ImagenConRespaldo, { IMAGEN_RESPALDO } from "./ImagenConRespaldo";

describe("ImagenConRespaldo", () => {
  it("reemplaza la imagen por la local cuando la original no carga", () => {
    render(<ImagenConRespaldo src="https://ejemplo.cl/rota.jpg" alt="Producto" />);
    const imagen = screen.getByRole("img", { name: "Producto" });
    expect(imagen).toHaveAttribute("src", "https://ejemplo.cl/rota.jpg");
    fireEvent.error(imagen);
    expect(imagen).toHaveAttribute("src", IMAGEN_RESPALDO);
  });
});
