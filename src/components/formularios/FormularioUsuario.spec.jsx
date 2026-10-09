import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FormularioUsuario from "./FormularioUsuario";

async function completarFormulario(usuario) {
  await usuario.type(screen.getByLabelText("RUN (sin puntos ni guion)"), "213456784");
  await usuario.type(screen.getByLabelText("Nombre"), "Ana");
  await usuario.type(screen.getByLabelText("Apellidos"), "Pérez Soto");
  await usuario.type(screen.getByLabelText("Correo electrónico"), "ana@gmail.com");
  await usuario.type(screen.getByLabelText("Dirección"), "Av. Brasil 100");
  await usuario.selectOptions(screen.getByLabelText("Región"), "OHI");
  await usuario.selectOptions(screen.getByLabelText("Comuna"), "Rancagua");
  await usuario.type(screen.getByLabelText(/^Contraseña/), "clave1");
  await usuario.type(screen.getByLabelText("Confirmar contraseña"), "clave1");
}

describe("FormularioUsuario (formulario controlado)", () => {
  it("actualiza el estado del campo cuando el usuario escribe", async () => {
    const usuario = userEvent.setup();
    render(<FormularioUsuario modo="registro" onGuardar={vi.fn()} textoBoton="Registrarme" />);
    const nombre = screen.getByLabelText("Nombre");
    await usuario.type(nombre, "Javiera");
    expect(nombre).toHaveValue("Javiera");
  });

  it("muestra mensajes de error solo después de enviar datos inválidos", async () => {
    const usuario = userEvent.setup();
    const onGuardar = vi.fn();
    render(<FormularioUsuario modo="registro" onGuardar={onGuardar} textoBoton="Registrarme" />);
    expect(screen.queryByText("El RUN es obligatorio")).not.toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(screen.getByText("El RUN es obligatorio")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveClass("is-invalid");
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("carga las comunas de la región elegida", async () => {
    const usuario = userEvent.setup();
    render(<FormularioUsuario modo="registro" onGuardar={vi.fn()} textoBoton="Registrarme" />);
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna).toBeDisabled();
    await usuario.selectOptions(screen.getByLabelText("Región"), "OHI");
    expect(comuna).toBeEnabled();
    expect(screen.getByRole("option", { name: "Machalí" })).toBeInTheDocument();
  });

  it("envía los datos válidos a onGuardar", async () => {
    const usuario = userEvent.setup();
    const onGuardar = vi.fn();
    render(<FormularioUsuario modo="registro" onGuardar={onGuardar} textoBoton="Registrarme" />);
    await completarFormulario(usuario);
    await usuario.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({ run: "213456784", comuna: "Rancagua", correo: "ana@gmail.com" }));
  });

  it("muestra el error que lanza onGuardar, por ejemplo un RUN repetido", async () => {
    const usuario = userEvent.setup();
    const onGuardar = vi.fn(() => {
      throw new Error("Ya existe un usuario registrado con ese RUN.");
    });
    render(<FormularioUsuario modo="registro" onGuardar={onGuardar} textoBoton="Registrarme" />);
    await completarFormulario(usuario);
    await usuario.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe un usuario registrado con ese RUN.");
  });
});
