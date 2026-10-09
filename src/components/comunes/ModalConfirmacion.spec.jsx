import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ModalConfirmacion from "./ModalConfirmacion";

describe("ModalConfirmacion", () => {
  it("el botón recibe la etiqueta y la función onClick por props", async () => {
    const usuario = userEvent.setup();
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();
    render(
      <ModalConfirmacion
        mostrar
        titulo="Eliminar producto"
        mensaje="¿Seguro?"
        textoConfirmar="Sí, eliminar"
        onConfirmar={onConfirmar}
        onCancelar={onCancelar}
      />
    );
    await usuario.click(screen.getByRole("button", { name: "Sí, eliminar" }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
    await usuario.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it("no muestra contenido cuando mostrar es falso", () => {
    render(<ModalConfirmacion mostrar={false} titulo="Eliminar" mensaje="Oculto" onConfirmar={vi.fn()} onCancelar={vi.fn()} />);
    expect(screen.queryByText("Oculto")).not.toBeInTheDocument();
  });
});
