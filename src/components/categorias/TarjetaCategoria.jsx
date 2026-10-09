import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImagenConRespaldo from "../comunes/ImagenConRespaldo";

function TarjetaCategoria({ categoria, cantidad }) {
  return (
    <Card className="h-100 shadow-sm tarjeta-enlace text-center">
      <ImagenConRespaldo src={categoria.imagen} alt="" className="card-img-top imagen-tarjeta" />
      <Card.Body>
        <h3 className="h6 mb-1">
          <Link to={`/categorias/${categoria.id}`} className="stretched-link text-decoration-none">
            {categoria.nombre}
          </Link>
        </h3>
        <p className="small text-body-secondary mb-0">
          {cantidad} {cantidad === 1 ? "producto" : "productos"}
        </p>
      </Card.Body>
    </Card>
  );
}

export default TarjetaCategoria;
