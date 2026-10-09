import { inventarioPorCategoria, productosMasVendidos, resumenVentas, ventasPorCategoria } from "./reportes";

const ordenes = [
  { estado: "Pagada", total: 20000, items: [{ codigo: "A", nombre: "Producto A", precioUnitario: 5000, cantidad: 4 }] },
  { estado: "Pagada", total: 10000, items: [{ codigo: "B", nombre: "Producto B", precioUnitario: 10000, cantidad: 1 }] },
  { estado: "Rechazada", total: 99000, items: [{ codigo: "B", nombre: "Producto B", precioUnitario: 99000, cantidad: 1 }] }
];
const productos = [
  { codigo: "A", categoria: "c1", stock: 3, precio: 5000, stockCritico: 5 },
  { codigo: "B", categoria: "c2", stock: 10, precio: 10000, stockCritico: 2 }
];
const categorias = [{ id: "c1", nombre: "Uno" }, { id: "c2", nombre: "Dos" }];

describe("reportes de administración", () => {
  it("resume solo las ventas pagadas", () => {
    expect(resumenVentas(ordenes)).toEqual({
      cantidadOrdenes: 3,
      cantidadPagadas: 2,
      cantidadRechazadas: 1,
      totalVendido: 30000,
      ticketPromedio: 15000
    });
    expect(resumenVentas([]).ticketPromedio).toBe(0);
  });

  it("ordena productos más vendidos y ventas por categoría", () => {
    expect(productosMasVendidos(ordenes)[0]).toEqual({ codigo: "A", nombre: "Producto A", cantidad: 4 });
    expect(ventasPorCategoria(ordenes, productos, categorias)).toEqual([
      { id: "c1", nombre: "Uno", total: 20000 },
      { id: "c2", nombre: "Dos", total: 10000 }
    ]);
  });

  it("valoriza el inventario y cuenta los productos críticos por categoría", () => {
    const [uno] = inventarioPorCategoria(productos, categorias);
    expect(uno).toEqual({ id: "c1", nombre: "Uno", productos: 1, unidades: 3, valorizado: 15000, criticos: 1 });
  });
});
