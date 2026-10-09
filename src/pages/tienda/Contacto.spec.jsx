import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { listarMensajesContacto } from "../../data/baseDatos";
import { renderConRouter } from "../../test/utilidades";
import Contacto from "./Contacto";

describe("Página Contacto", () => {
  it("guarda el mensaje válido, muestra confirmación y limpia el formulario", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Contacto />);
    await usuario.type(screen.getByLabelText("Nombre completo"), "Camila Morales");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "camila@duoc.cl");
    await usuario.type(screen.getByLabelText("Comentario o consulta"), "Mi perro no quiere comer.");
    expect(screen.getByText("25/500 caracteres")).toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByRole("status")).toHaveTextContent("Mensaje enviado exitosamente");
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("");
    expect(listarMensajesContacto()).toHaveLength(1);
  });
});
