import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { listarCategorias } from "../../data/baseDatos";
import { esFormularioValido, validarProducto } from "../../utils/validaciones";
import ImagenConRespaldo from "../comunes/ImagenConRespaldo";

const VACIO = {
  codigo: "",
  nombre: "",
  categoria: "",
  presentacion: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  stock: "",
  stockCritico: "",
  imagen: ""
};

// Convierte un producto guardado (con números) en valores de formulario (texto).
function aFormulario(producto) {
  if (!producto) return VACIO;
  return {
    ...VACIO,
    ...producto,
    precio: String(producto.precio),
    precioOferta: producto.precioOferta === null ? "" : String(producto.precioOferta),
    stock: String(producto.stock),
    stockCritico: String(producto.stockCritico)
  };
}

function FormularioProducto({ inicial, onGuardar, textoBoton, editando = false }) {
  const [datos, setDatos] = useState(() => aFormulario(inicial));
  const [errores, setErrores] = useState({});
  const [intentado, setIntentado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const categorias = listarCategorias();

  function cambiar(evento) {
    const { name, value } = evento.target;
    const nuevos = { ...datos, [name]: value };
    setDatos(nuevos);
    if (intentado) setErrores(validarProducto(nuevos));
  }

  function enviar(evento) {
    evento.preventDefault();
    setIntentado(true);
    setErrorGeneral("");
    const nuevosErrores = validarProducto(datos);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;
    try {
      onGuardar(datos);
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  function campo(nombre, etiqueta, propiedades = {}, columnas = 6, ayuda = "") {
    return (
      <Col xs={12} md={columnas}>
        <Form.Group controlId={`producto-${nombre}`}>
          <Form.Label>{etiqueta}</Form.Label>
          <Form.Control
            name={nombre}
            value={datos[nombre]}
            onChange={cambiar}
            isInvalid={Boolean(errores[nombre])}
            {...propiedades}
          />
          {ayuda && <Form.Text>{ayuda}</Form.Text>}
          <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    );
  }

  return (
    <Form noValidate onSubmit={enviar} aria-label="Formulario de producto">
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}
      <Row className="g-3">
        {campo("codigo", "Código", {
          placeholder: "Ej: ME020",
          readOnly: editando,
          className: editando ? "bg-body-tertiary" : undefined
        }, 4)}
        {campo("nombre", "Nombre", { maxLength: 100 }, 8)}
        <Col xs={12} md={6}>
          <Form.Group controlId="producto-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={datos.categoria}
              onChange={cambiar}
              isInvalid={Boolean(errores.categoria)}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        {campo("presentacion", "Presentación (opcional)", { placeholder: "Ej: Blíster 10 comp." })}
        {campo("descripcion", "Descripción (opcional)", { as: "textarea", rows: 3, maxLength: 500 }, 12)}
        {campo("precio", "Precio (pesos)", { type: "number", min: 0 }, 3, "Escribe 0 si es gratuito.")}
        {campo("precioOferta", "Precio oferta (opcional)", { type: "number", min: 0 }, 3)}
        {campo("stock", "Stock", { type: "number", min: 0 }, 3)}
        {campo("stockCritico", "Stock crítico (opcional)", { type: "number", min: 0 }, 3, "Alerta cuando el stock llegue a este valor.")}
        {campo("imagen", "URL de imagen (opcional)", { type: "url", placeholder: "https://..." }, 9)}
        <Col xs={12} md={3}>
          <p className="form-label mb-2">Vista previa</p>
          <ImagenConRespaldo src={datos.imagen} alt="Vista previa de la imagen" className="img-fluid rounded border imagen-tarjeta" />
        </Col>
      </Row>
      <div className="mt-4 d-flex gap-2">
        <Button type="submit">{textoBoton}</Button>
      </div>
    </Form>
  );
}

export default FormularioProducto;
