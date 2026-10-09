import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import LayoutTienda from "./components/layout/LayoutTienda";
import RutaAdmin from "./components/layout/RutaAdmin";
import { obtenerProducto } from "./data/baseDatos";
import NoEncontrada from "./pages/NoEncontrada";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import Dashboard from "./pages/admin/Dashboard";
import DetalleOrden from "./pages/admin/DetalleOrden";
import DetalleProductoAdmin from "./pages/admin/DetalleProductoAdmin";
import DetalleUsuario from "./pages/admin/DetalleUsuario";
import EditarCategoria from "./pages/admin/EditarCategoria";
import EditarProducto from "./pages/admin/EditarProducto";
import EditarUsuario from "./pages/admin/EditarUsuario";
import HistorialCompras from "./pages/admin/HistorialCompras";
import NuevaCategoria from "./pages/admin/NuevaCategoria";
import NuevoProducto from "./pages/admin/NuevoProducto";
import NuevoUsuario from "./pages/admin/NuevoUsuario";
import Ordenes from "./pages/admin/Ordenes";
import Perfil from "./pages/admin/Perfil";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import ProductosCriticos from "./pages/admin/ProductosCriticos";
import ReporteProductos from "./pages/admin/ReporteProductos";
import Reportes from "./pages/admin/Reportes";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import Blogs from "./pages/tienda/Blogs";
import Carrito from "./pages/tienda/Carrito";
import CategoriaDetalle from "./pages/tienda/CategoriaDetalle";
import Categorias from "./pages/tienda/Categorias";
import Checkout from "./pages/tienda/Checkout";
import CompraError from "./pages/tienda/CompraError";
import CompraExitosa from "./pages/tienda/CompraExitosa";
import Contacto from "./pages/tienda/Contacto";
import DetalleBlog from "./pages/tienda/DetalleBlog";
import DetalleProducto from "./pages/tienda/DetalleProducto";
import Inicio from "./pages/tienda/Inicio";
import Login from "./pages/tienda/Login";
import Nosotros from "./pages/tienda/Nosotros";
import Ofertas from "./pages/tienda/Ofertas";
import Productos from "./pages/tienda/Productos";
import Registro from "./pages/tienda/Registro";
import { agregarItem, cambiarCantidad, quitarItem } from "./utils/carrito";
import { guardarCarrito, guardarSesion, leerCarrito, leerSesion } from "./utils/persistencia";

// App guarda el estado compartido por varias páginas (carrito y sesión)
// y define el mapa de rutas públicas y administrativas.
function App() {
  const [carrito, setCarrito] = useState(() => leerCarrito());
  const [sesion, setSesion] = useState(() => leerSesion());
  const [aviso, setAviso] = useState(null);

  // Cada vez que cambia el carrito o la sesión, se sincroniza con localStorage.
  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  useEffect(() => {
    guardarSesion(sesion);
  }, [sesion]);

  function agregarAlCarrito(producto, cantidad = 1) {
    try {
      setCarrito(agregarItem(carrito, producto, cantidad));
      setAviso({ tipo: "exito", texto: `"${producto.nombre}" se agregó al carrito.` });
    } catch (error) {
      setAviso({ tipo: "error", texto: error.message });
    }
  }

  function cambiarCantidadCarrito(codigo, cantidad) {
    const producto = obtenerProducto(codigo);
    setCarrito(cambiarCantidad(carrito, codigo, cantidad, producto ? producto.stock : 0));
  }

  function quitarDelCarrito(codigo) {
    setCarrito(quitarItem(carrito, codigo));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function cerrarSesion() {
    setSesion(null);
  }

  const propsTienda = { onAgregar: agregarAlCarrito };

  return (
    <Routes>
      <Route
        element={
          <LayoutTienda
            carrito={carrito}
            sesion={sesion}
            onCerrarSesion={cerrarSesion}
            aviso={aviso}
            onCerrarAviso={() => setAviso(null)}
          />
        }
      >
        <Route index element={<Inicio {...propsTienda} />} />
        <Route path="productos" element={<Productos {...propsTienda} />} />
        <Route path="productos/:codigo" element={<DetalleProducto {...propsTienda} />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<CategoriaDetalle {...propsTienda} />} />
        <Route path="ofertas" element={<Ofertas {...propsTienda} />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="registro" element={<Registro onIniciarSesion={setSesion} />} />
        <Route path="login" element={<Login sesion={sesion} onIniciarSesion={setSesion} />} />
        <Route
          path="carrito"
          element={
            <Carrito
              carrito={carrito}
              onCambiarCantidad={cambiarCantidadCarrito}
              onQuitar={quitarDelCarrito}
              onVaciar={vaciarCarrito}
              onAgregar={agregarAlCarrito}
            />
          }
        />
        <Route
          path="checkout"
          element={<Checkout carrito={carrito} sesion={sesion} onCompraExitosa={vaciarCarrito} />}
        />
        <Route path="compra/exitosa/:numero" element={<CompraExitosa />} />
        <Route path="compra/error/:numero" element={<CompraError />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route
        path="admin"
        element={
          <RutaAdmin sesion={sesion}>
            <LayoutAdmin sesion={sesion} onCerrarSesion={cerrarSesion} />
          </RutaAdmin>
        }
      >
        <Route index element={<Dashboard sesion={sesion} />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:numero" element={<DetalleOrden />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<NuevoProducto />} />
        <Route path="productos/criticos" element={<ProductosCriticos />} />
        <Route path="productos/reportes" element={<ReporteProductos />} />
        <Route path="productos/:codigo" element={<DetalleProductoAdmin />} />
        <Route path="productos/:codigo/editar" element={<EditarProducto />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="categorias/nueva" element={<NuevaCategoria />} />
        <Route path="categorias/:id/editar" element={<EditarCategoria />} />
        <Route path="usuarios" element={<UsuariosAdmin sesion={sesion} />} />
        <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
        <Route path="usuarios/:run" element={<DetalleUsuario />} />
        <Route
          path="usuarios/:run/editar"
          element={<EditarUsuario sesion={sesion} onActualizarSesion={setSesion} />}
        />
        <Route path="usuarios/:run/compras" element={<HistorialCompras />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil sesion={sesion} onActualizarSesion={setSesion} />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
