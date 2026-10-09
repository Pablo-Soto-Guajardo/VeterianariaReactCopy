# Veterinaria San Marcos – Tienda online (React)

Tienda online y panel de administración de la **Veterinaria San Marcos** (Rancagua), desarrollada para la
asignatura **Desarrollo FullStack II (DSY1104)** de Duoc UC – Evaluación Parcial 2.

La versión de la Evaluación 1 (HTML, CSS y JavaScript) se conserva en el repositorio
[VeterinariaGrupo5](https://github.com/Pablo-Soto-Guajardo/VeterinariaGrupo5).

## Integrantes – Grupo 5

- Pablo Esteban Soto Guajardo
- Maximiliano Andrés Mondaca Grandón
- Pascal Ignacio Pacheco Bravo

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| React 19 + Vite | Framework de interfaz y empaquetador |
| React Router | Navegación SPA, rutas dinámicas y rutas protegidas |
| React Bootstrap + Bootstrap 5 | Componentes y grilla responsiva |
| Bootstrap Icons | Íconos |
| Vitest + jsdom + React Testing Library + user-event | Pruebas unitarias y de componentes |
| @vitest/coverage-v8 | Informe de cobertura |
| Nginx sobre AWS EC2 | Publicación del build de producción |

> **Sobre Jasmine y Karma:** la pauta menciona Jasmine y Karma. Según la Guía 13 del curso, la institución
> autorizó reemplazarlos por Vitest y React Testing Library, que se integran con Vite. Vitest usa la misma
> sintaxis (`describe`, `it`, `expect`) y agrega `vi.fn`, `vi.spyOn` y `vi.mock` para simular dependencias.

## Cómo ejecutar

```bash
npm install
npm run dev          # servidor de desarrollo (http://localhost:5173)
npm run build        # build de producción en dist/
npm run preview      # revisa el build localmente
npm run lint         # análisis estático con oxlint
npm test             # pruebas en modo observación
npm run test:run     # ejecuta las pruebas una vez
npm run coverage     # pruebas + informe de cobertura (coverage/index.html)
```

### Cuentas y datos de demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@duoc.cl | admin123 |
| Recepcionista | camila.valenzuela@duoc.cl | recep123 |
| Cliente | cliente@gmail.com | cliente1 |

Tarjetas de prueba en el checkout: **4111 1111 1111 1111** (aprobada) y **4000 0000 0000 0002** (rechazada).

Los datos se guardan en `localStorage`. Para volver a los datos de ejemplo, borra las claves que empiezan con
`sanMarcos.` desde las herramientas del navegador (Application → Local Storage).

## Mapa de rutas

### Tienda (públicas)

| URL | Vista |
| --- | --- |
| `/` | Home: carrusel, categorías, ofertas y destacados |
| `/productos` | Catálogo con búsqueda, filtro por categoría, solo con stock y orden |
| `/productos/:codigo` | Detalle de producto y productos relacionados |
| `/categorias` y `/categorias/:id` | Categorías y productos de una categoría |
| `/ofertas` | Productos con precio rebajado |
| `/nosotros` | Historia, misión, visión y equipo |
| `/blogs` y `/blogs/:id` | Noticias y detalle de cada artículo |
| `/contacto` | Formulario de contacto validado |
| `/registro` y `/login` | Registro de usuario e inicio de sesión |
| `/carrito` | Carrito con cantidades, total y productos sugeridos |
| `/checkout` | Datos del cliente, dirección de entrega y pago simulado |
| `/compra/exitosa/:numero` | Compra realizada y boleta |
| `/compra/error/:numero` | Pago rechazado con opción de reintentar |
| `*` | Página 404 |

### Administración (requiere sesión con rol Administrador)

| URL | Vista |
| --- | --- |
| `/admin` | Dashboard con métricas y accesos |
| `/admin/ordenes` y `/admin/ordenes/:numero` | Órdenes y boleta |
| `/admin/productos` | Listado con búsqueda, ver, editar y eliminar |
| `/admin/productos/nuevo` | Nuevo producto |
| `/admin/productos/:codigo` y `/admin/productos/:codigo/editar` | Mostrar y editar producto |
| `/admin/productos/criticos` | Productos con stock crítico o agotado |
| `/admin/productos/reportes` | Inventario por categoría |
| `/admin/categorias`, `/nueva`, `/:id/editar` | Categorías |
| `/admin/usuarios`, `/nuevo`, `/:run`, `/:run/editar`, `/:run/compras` | Usuarios e historial de compras |
| `/admin/reportes` | Ventas totales, por categoría y productos más vendidos |
| `/admin/perfil` | Perfil del administrador |

## Estructura del proyecto

```
src/
├── App.jsx                 Estado global (carrito y sesión) y mapa de rutas
├── main.jsx                Monta App dentro de BrowserRouter
├── components/             Componentes reutilizables
│   ├── admin/              Formularios y piezas del panel
│   ├── compra/             Tabla de ítems y datos de la orden
│   ├── formularios/        FormularioUsuario y SelectorRegionComuna
│   ├── layout/             Encabezado, pie, layouts y RutaAdmin
│   └── productos/          TarjetaProducto, GrillaProductos, precio y stock
├── data/
│   ├── datosIniciales.js   Datos de ejemplo
│   └── baseDatos.js        Base de datos simulada con funciones CRUD
├── pages/
│   ├── tienda/             Vistas públicas
│   └── admin/              Vistas de administración
├── services/pagos.js       Pasarela de pago simulada (asíncrona)
├── utils/                  Validaciones, carrito, precios, filtros, reportes y persistencia
├── styles/tema.css         Identidad visual sobre Bootstrap
└── test/                   Configuración y ayudas de pruebas
```

Cada componente tiene una sola responsabilidad. Los datos llegan por **props**, los formularios son
**controlados** con `useState` y el estado compartido (carrito y sesión) vive en `App` y se sincroniza con
`localStorage` mediante `useEffect`.

### Base de datos simulada (CRUD)

`src/data/baseDatos.js` es la única puerta de acceso a los datos. Cada colección (productos, categorías,
usuarios, órdenes y mensajes) tiene funciones para **crear, leer, actualizar y eliminar**, con reglas del
negocio: códigos únicos, RUN y correo únicos, no eliminar categorías en uso ni al único administrador, y
descontar stock solo si alcanza. Las contraseñas no se guardan en texto original. La autenticación real se
implementará en el backend en la siguiente evaluación.

## Diseño responsivo

Se usa la grilla de React Bootstrap (`Container`, `Row`, `Col`). El catálogo muestra 1 columna en móvil, 2 desde
576 px, 3 desde 992 px y 4 desde 1200 px. El menú se contrae en un botón "Menú" bajo 992 px y el panel de
administración pasa de barra lateral a menú superior.

Revisión realizada en 375, 768, 1024 y 1440 px sobre las 37 rutas: sin desplazamiento horizontal, una sola
`h1` por página, foco visible, todas las imágenes con `alt` y todos los campos con su etiqueta.

## Pruebas y cobertura

**131 pruebas** en 27 archivos `.spec.js` / `.spec.jsx`, todas aprobadas.

| Métrica | Cobertura |
| --- | --- |
| Statements | 93,8 % |
| Branches | 86,1 % |
| Functions | 92,6 % |
| Lines | 94,8 % |

Incluyen pruebas de renderizado, renderizado condicional, props, estado, eventos, un **spy** sobre
`localStorage` (`vi.spyOn`) y un **mock** del servicio de pago (`vi.mock`) para probar compras aprobadas y
rechazadas sin esperar ni depender de un servicio real. El detalle está en el documento de cobertura de testing.

## Despliegue en AWS EC2

| Dato | Valor |
| --- | --- |
| URL pública | `http://IP_PUBLICA` *(completar después de desplegar)* |
| Fecha de despliegue | *pendiente* |
| Servidor | Nginx sobre Ubuntu Server LTS |

1. Generar el build: `npm run build`.
2. Copiar el build y la configuración a la instancia (PowerShell, dentro del proyecto):

   ```powershell
   ssh -i "RUTA\CLAVE.pem" ubuntu@IP_PUBLICA "mkdir -p /tmp/veterinaria"
   scp -i "RUTA\CLAVE.pem" -r ".\dist\*" ubuntu@IP_PUBLICA:/tmp/veterinaria/
   scp -i "RUTA\CLAVE.pem" ".\deploy\veterinaria-san-marcos.nginx.conf" ubuntu@IP_PUBLICA:/tmp/
   ```

3. En la instancia:

   ```bash
   sudo mkdir -p /var/www/veterinaria-san-marcos
   sudo cp -a /tmp/veterinaria/. /var/www/veterinaria-san-marcos/
   sudo chown -R www-data:www-data /var/www/veterinaria-san-marcos
   sudo cp /tmp/veterinaria-san-marcos.nginx.conf /etc/nginx/sites-available/veterinaria-san-marcos
   sudo ln -sfn /etc/nginx/sites-available/veterinaria-san-marcos /etc/nginx/sites-enabled/veterinaria-san-marcos
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl reload nginx
   ```

La regla `try_files $uri $uri/ /index.html` permite recargar rutas internas como `/productos/ME005`.

## Créditos de imágenes

Fotografías de [Unsplash](https://unsplash.com), las mismas usadas en la Evaluación 1. Si una imagen externa no
carga, se muestra la imagen local `public/img/sin-imagen.svg`.
