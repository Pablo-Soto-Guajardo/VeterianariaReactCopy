import { Container } from "react-bootstrap";
import TarjetaBlog from "../../components/blogs/TarjetaBlog";
import { blogs } from "../../data/datosIniciales";

function Blogs() {
  return (
    <Container className="py-4">
      <p className="text-uppercase text-primary fw-semibold mb-1">Educación sanitaria</p>
      <h1 className="mb-4">Noticias importantes</h1>
      <div className="d-flex flex-column gap-4">
        {blogs.map((blog) => (
          <TarjetaBlog key={blog.id} blog={blog} />
        ))}
      </div>
    </Container>
  );
}

export default Blogs;
