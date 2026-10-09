import { Carousel, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TarjetaCategoria from "../../components/categorias/TarjetaCategoria";
import ImagenConRespaldo from "../../components/comunes/ImagenConRespaldo";
import GrillaProductos from "../../components/productos/GrillaProductos";
import { listarCategorias, listarProductos, listarProductosEnOferta } from "../../data/baseDatos";
import { imagenes } from "../../data/datosIniciales";

const diapositivas = [
  {
    imagen: imagenes.clinica,
    titulo: "Farmacia veterinaria en Rancagua",
    texto: "Medicamentos certificados y alimentos clínicos con despacho a todo Chile.",
    enlace: "/productos",
    boton: "Ver productos"
  },
  {
    imagen: imagenes.gato,
    titulo: "Ofertas de la semana",
    texto: "Antiparasitarios y dietas clínicas con descuentos de hasta 20%.",
    enlace: "/ofertas",
    boton: "Ver ofertas"
  },
  {
    imagen: imagenes.cachorro,
    titulo: "Consejos de nuestros veterinarios",
    texto: "Lee nuestras guías sobre vacunación y cuidado de la piel.",
    enlace: "/blogs",
    boton: "Ir al blog"
  }
];

const beneficios = [
  { icono: "bi-patch-check", titulo: "Productos certificados", texto: "Medicamentos con registro SAG y despacho refrigerado cuando corresponde." },
  { icono: "bi-truck", titulo: "Despacho a regiones", texto: "Enviamos a las 16 regiones del país en 24 a 72 horas hábiles." },
  { icono: "bi-heart-pulse", titulo: "Asesoría veterinaria", texto: "Nuestro equipo clínico responde tus dudas antes de comprar." }
];

function Inicio({ onAgregar }) {
  const categorias = listarCategorias();
  const productos = listarProductos();
  const ofertas = listarProductosEnOferta().slice(0, 4);
  const destacados = productos.filter((producto) => producto.stock > 0).slice(0, 4);

  function contarProductos(idCategoria) {
    return productos.filter((producto) => producto.categoria === idCategoria).length;
  }

  return (
    <>
      <h1 className="visually-hidden">Veterinaria San Marcos: tienda online</h1>
      <Carousel
        className="bg-dark"
        interval={6000}
        aria-label="Novedades de la tienda"
        prevLabel="Anterior"
        nextLabel="Siguiente"
        indicatorLabels={diapositivas.map((_, indice) => `Diapositiva ${indice + 1}`)}
      >
        {diapositivas.map((diapositiva) => (
          <Carousel.Item key={diapositiva.titulo}>
            <ImagenConRespaldo src={diapositiva.imagen} alt="" className="d-block w-100 imagen-carrusel" />
            <Carousel.Caption className="pb-5">
              <p className="h2 fw-bold">{diapositiva.titulo}</p>
              <p className="d-none d-sm-block">{diapositiva.texto}</p>
              <Link to={diapositiva.enlace} className="btn btn-light">
                {diapositiva.boton}
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container className="py-5">
        <section aria-labelledby="titulo-categorias" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 id="titulo-categorias" className="h3 mb-0">Categorías</h2>
            <Link to="/categorias">Ver todas</Link>
          </div>
          <Row className="g-3">
            {categorias.map((categoria) => (
              <Col xs={6} md={4} lg={2} key={categoria.id}>
                <TarjetaCategoria categoria={categoria} cantidad={contarProductos(categoria.id)} />
              </Col>
            ))}
          </Row>
        </section>

        <section aria-labelledby="titulo-ofertas" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 id="titulo-ofertas" className="h3 mb-0">Ofertas destacadas</h2>
            <Link to="/ofertas">Ver todas las ofertas</Link>
          </div>
          <GrillaProductos productos={ofertas} onAgregar={onAgregar} />
        </section>

        <section aria-labelledby="titulo-destacados" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 id="titulo-destacados" className="h3 mb-0">Productos destacados en stock</h2>
            <Link to="/productos">Ver catálogo</Link>
          </div>
          <GrillaProductos productos={destacados} onAgregar={onAgregar} />
        </section>

        <section aria-labelledby="titulo-beneficios">
          <h2 id="titulo-beneficios" className="h3 mb-3">¿Por qué comprar en San Marcos?</h2>
          <Row className="g-4">
            {beneficios.map((beneficio) => (
              <Col xs={12} md={4} key={beneficio.titulo}>
                <div className="bg-white border rounded-3 p-4 h-100">
                  <i className={`bi ${beneficio.icono} fs-2 text-primary`} aria-hidden="true"></i>
                  <h3 className="h5 mt-2">{beneficio.titulo}</h3>
                  <p className="mb-0 text-body-secondary">{beneficio.texto}</p>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Inicio;
