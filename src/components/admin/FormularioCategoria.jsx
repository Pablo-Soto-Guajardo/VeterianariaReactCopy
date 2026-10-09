import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { esFormularioValido, validarCategoria } from "../../utils/validaciones";

function FormularioCategoria({ inicial, onGuardar, textoBoton }) {
  const [datos, setDatos] = useState({
    nombre: inicial?.nombre || "",
    descripcion: inicial?.descripcion || "",
    imagen: inicial?.imagen || ""
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    const nuevosErrores = validarCategoria(datos);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;
    try {
      onGuardar(datos);
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  return (
    <Form noValidate onSubmit={enviar} aria-label="Formulario de categoría" style={{ maxWidth: "40rem" }}>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}
      <Form.Group className="mb-3" controlId="categoria-nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="nombre"
          value={datos.nombre}
          onChange={cambiar}
          maxLength={50}
          isInvalid={Boolean(errores.nombre)}
        />
        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="categoria-descripcion">
        <Form.Label>Descripción (opcional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="descripcion"
          value={datos.descripcion}
          onChange={cambiar}
          maxLength={200}
          isInvalid={Boolean(errores.descripcion)}
        />
        <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="categoria-imagen">
        <Form.Label>URL de imagen (opcional)</Form.Label>
        <Form.Control type="url" name="imagen" value={datos.imagen} onChange={cambiar} />
      </Form.Group>
      <Button type="submit">{textoBoton}</Button>
    </Form>
  );
}

export default FormularioCategoria;
