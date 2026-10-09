// Cálculos para los reportes del panel de administración.

export function ordenesPagadas(ordenes) {
  return ordenes.filter((orden) => orden.estado === "Pagada");
}

export function resumenVentas(ordenes) {
  const pagadas = ordenesPagadas(ordenes);
  const totalVendido = pagadas.reduce((suma, orden) => suma + orden.total, 0);
  return {
    cantidadOrdenes: ordenes.length,
    cantidadPagadas: pagadas.length,
    cantidadRechazadas: ordenes.length - pagadas.length,
    totalVendido,
    ticketPromedio: pagadas.length === 0 ? 0 : Math.round(totalVendido / pagadas.length)
  };
}

export function ventasPorCategoria(ordenes, productos, categorias) {
  const totales = {};
  for (const orden of ordenesPagadas(ordenes)) {
    for (const item of orden.items) {
      const producto = productos.find((p) => p.codigo === item.codigo);
      const idCategoria = producto ? producto.categoria : "sin-categoria";
      totales[idCategoria] = (totales[idCategoria] || 0) + item.precioUnitario * item.cantidad;
    }
  }
  return Object.entries(totales)
    .map(([id, total]) => {
      const categoria = categorias.find((c) => c.id === id);
      return { id, nombre: categoria ? categoria.nombre : "Sin categoría", total };
    })
    .sort((a, b) => b.total - a.total);
}

export function productosMasVendidos(ordenes, limite = 5) {
  const unidades = {};
  for (const orden of ordenesPagadas(ordenes)) {
    for (const item of orden.items) {
      if (!unidades[item.codigo]) {
        unidades[item.codigo] = { codigo: item.codigo, nombre: item.nombre, cantidad: 0 };
      }
      unidades[item.codigo].cantidad += item.cantidad;
    }
  }
  return Object.values(unidades)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limite);
}

export function inventarioPorCategoria(productos, categorias) {
  return categorias.map((categoria) => {
    const propios = productos.filter((p) => p.categoria === categoria.id);
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      productos: propios.length,
      unidades: propios.reduce((suma, p) => suma + p.stock, 0),
      valorizado: propios.reduce((suma, p) => suma + p.stock * p.precio, 0),
      criticos: propios.filter((p) => p.stock <= p.stockCritico).length
    };
  });
}
