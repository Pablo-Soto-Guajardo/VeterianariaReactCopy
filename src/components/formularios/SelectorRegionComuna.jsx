import { Col, Form } from "react-bootstrap";
import { regiones } from "../../data/datosIniciales";
import { obtenerComunas } from "../../utils/regiones";

// Dos listas dependientes: las comunas cambian según la región elegida.
function SelectorRegionComuna({ region, comuna, onCambiarRegion, onCambiarComuna, errores = {}, prefijo = "" }) {
  const comunas = obtenerComunas(region);

  return (
    <>
      <Col xs={12} md={6}>
        <Form.Group controlId={`${prefijo}region`}>
          <Form.Label>Región</Form.Label>
          <Form.Select
            value={region}
            onChange={(evento) => onCambiarRegion(evento.target.value)}
            isInvalid={Boolean(errores.region)}
          >
            <option value="">Selecciona una región</option>
            {regiones.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group controlId={`${prefijo}comuna`}>
          <Form.Label>Comuna</Form.Label>
          <Form.Select
            value={comuna}
            onChange={(evento) => onCambiarComuna(evento.target.value)}
            isInvalid={Boolean(errores.comuna)}
            disabled={comunas.length === 0}
          >
            <option value="">{comunas.length === 0 ? "Primero elige una región" : "Selecciona una comuna"}</option>
            {comunas.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default SelectorRegionComuna;
