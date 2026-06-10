import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const Inicio = () => {
  const [cargando, setCargando] = useState(true);
  const graficoHoraRef = useRef(null);
  const graficoCategoriaRef = useRef(null);

  const generarPdfGeneral = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      // Header Banner
      pdf.setFillColor(145, 123, 49); // #917b31
      pdf.rect(0, 0, 210, 25, "F");

      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte General de Estadísticas", 105, 12, { align: "center" });

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Período: ${fechaDesde} al ${fechaHasta}`, 105, 19, { align: "center" });

      // Title for stats
      pdf.setFontSize(14);
      pdf.setTextColor(145, 123, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General de Ventas", 14, 38);

      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(14, 41, 196, 41);

      const datosResumen = [
        ["Total Ventas", `C$ ${estadisticas.totalVentas.toFixed(2)}`],
        ["Ventas en Efectivo", `C$ ${estadisticas.ventasEfectivo.toFixed(2)}`],
        ["Ventas con Tarjeta", `C$ ${estadisticas.ventasTarjeta.toFixed(2)}`],
        ["Productos Vendidos", estadisticas.productosVendidos],
        ["Cantidad de Ventas", estadisticas.cantidadVentas]
      ];

      autoTable(pdf, {
        startY: 45,
        body: datosResumen,
        theme: "grid",
        headStyles: { fillColor: [145, 123, 49] },
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: "bold", fillColor: [245, 245, 245], width: 100 },
          1: { halign: "right" }
        }
      });

      const finalY = pdf.lastAutoTable.finalY || 90;

      // Title for Hora Chart
      pdf.setFontSize(14);
      pdf.setTextColor(145, 123, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Gráfico de Ventas por Hora", 14, finalY + 15);
      pdf.line(14, finalY + 18, 196, finalY + 18);

      const canvasHora = await html2canvas(graficoHoraRef.current);
      const imagenHora = canvasHora.toDataURL("image/png");
      pdf.addImage(imagenHora, "PNG", 10, finalY + 23, 190, 80);

      pdf.addPage();
      
      // Page 2 Header
      pdf.setFillColor(145, 123, 49);
      pdf.rect(0, 0, 210, 15, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte General de Estadísticas - Continuación", 14, 10);

      pdf.setTextColor(145, 123, 49);
      pdf.setFontSize(14);
      pdf.text("Gráfico de Ventas por Categoría", 14, 30);
      pdf.line(14, 33, 196, 33);

      const canvasCat = await html2canvas(graficoCategoriaRef.current);
      const imagenCat = canvasCat.toDataURL("image/png");
      const imgCatWidth = 110;
      const imgCatHeight = (canvasCat.height * imgCatWidth) / canvasCat.width;

      pdf.addImage(imagenCat, "PNG", 50, 40, imgCatWidth, imgCatHeight);

      const startYTable2 = 40 + imgCatHeight + 15;
      
      pdf.text("Desglose por Categoría", 14, startYTable2);
      pdf.line(14, startYTable2 + 3, 196, startYTable2 + 3);

      const filasCat = estadisticas.ventasPorCategoria.map(item => [
        item.name,
        `C$ ${item.value}`
      ]);

      autoTable(pdf, {
        startY: startYTable2 + 8,
        head: [["Categoría", "Monto Vendido"]],
        body: filasCat,
        theme: "striped",
        headStyles: { fillColor: [145, 123, 49] }
      });

      const fechaActual = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      pdf.save(`Reporte_General_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF general");
    }
  };

  const generarPdfVentasCategoria = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(18);
      pdf.setTextColor("#917b31");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Categoría", 14, 15);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

      const canvas = await html2canvas(graficoCategoriaRef.current);
      const imagen = canvas.toDataURL("image/png");
      
      const imgWidth = 110;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imagen, "PNG", 50, 30, imgWidth, imgHeight);

      const startYText = 30 + imgHeight + 15;

      pdf.setFontSize(14);
      pdf.setTextColor("#917b31");
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", 14, startYText);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);

      pdf.text(`Total Ventas: C$ ${estadisticas.totalVentas.toFixed(2)}`, 14, startYText + 10);
      pdf.text(`Productos Vendidos: ${estadisticas.productosVendidos}`, 14, startYText + 17);

      const filas = estadisticas.ventasPorCategoria.map(item => [
        item.name,
        `C$ ${item.value}`
      ]);

      autoTable(pdf, {
        startY: startYText + 25,
        head: [["Categoría", "Monto Vendido"]],
        body: filas,
        headStyles: { fillColor: [145, 123, 49] }
      });

      const fechaActual = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      pdf.save(`VentasCategoria_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF de categorías");
    }
  };

  const generarPdfVentasHora = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      // Título y fecha
      pdf.setFontSize(18);
      pdf.setTextColor("#917b31");
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Ventas por Hora", 14, 15);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);
      pdf.text(`Periodo: ${fechaDesde} - ${fechaHasta}`, 14, 22);

      // Imagen del gráfico
      const canvas = await html2canvas(graficoHoraRef.current);
      const imagen = canvas.toDataURL("image/png");
      pdf.addImage(imagen, "PNG", 10, 30, 190, 80);

      // Resumen general
      pdf.setFontSize(14);
      pdf.setTextColor("#917b31");
      pdf.setFont("helvetica", "bold");
      pdf.text("Resumen General", 14, 115);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#000000");
      pdf.setFontSize(10);

      pdf.text(`Total Ventas: C$ ${estadisticas.totalVentas.toFixed(2)}`, 14, 125);
      pdf.text(`Ventas Efectivo: C$ ${estadisticas.ventasEfectivo.toFixed(2)}`, 14, 132);
      pdf.text(`Ventas Tarjeta: C$ ${estadisticas.ventasTarjeta.toFixed(2)}`, 14, 139);
      pdf.text(`Productos Vendidos: ${estadisticas.productosVendidos}`, 14, 146);
      pdf.text(`Cantidad Ventas: ${estadisticas.cantidadVentas}`, 14, 153);

      // Tabla de ventas por hora
      const filas = estadisticas.ventasPorHora.map(item => [
        item.hora,
        `C$ ${item.total}`
      ]);

      autoTable(pdf, {
        startY: 160,
        head: [["Hora", "Monto Acumulado"]],
        body: filas,
        headStyles: { fillColor: [145, 123, 49] }
      });

      // Descargar PDF
      const fechaActual = new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });
      pdf.save(`VentasHora_${fechaDesde}_${fechaHasta}_Generado_${fechaActual}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generando PDF");
    }
  };
  const [fechaDesde, setFechaDesde] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }),
  );
  const [fechaHasta, setFechaHasta] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" }),
  );

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ventasEfectivo: 0,
    ventasTarjeta: 0,
    productosVendidos: 0,
    montoProductos: 0,
    cantidadVentas: 0,
    ventasPorHora: [],
    ventasPorCategoria: [],
  });

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);
      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      const { data: ventas, error } = await supabase
        .from("ventas")
        .select("id_venta, total, fecha_venta, metodo_pago")
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango);

      if (error) throw error;

      const idsVentas = ventas?.map((v) => v.id_venta) || [];

      let productosVendidos = 0;
      let montoProductos = 0;
      let ventasPorCategoria = [];

      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(
            `
            cantidad,
            subtotal,
            productos (
              nombre_producto,
              categorias (
                nombre_categoria
              )
            )
          `,
          )
          .in("id_venta", idsVentas);

        if (errorDetalles) throw errorDetalles;

        detalles?.forEach((d) => {
          productosVendidos += d.cantidad || 0;
          montoProductos += d.subtotal || 0;

          const categoria =
            d.productos?.categorias?.nombre_categoria || "Sin categoría";
          const existente = ventasPorCategoria.find(
            (c) => c.name === categoria,
          );

          if (existente) {
            existente.value += d.subtotal || 0;
          } else {
            ventasPorCategoria.push({
              name: categoria,
              value: d.subtotal || 0,
            });
          }
        });

        ventasPorCategoria.sort((a, b) => b.value - a.value);
      }

      const totalVentas =
        ventas?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      const ventasEfectivo =
        ventas
          ?.filter((v) => v.metodo_pago === "efectivo")
          .reduce((sum, v) => sum + (v.total || 0), 0) || 0;
      const ventasTarjeta =
        ventas
          ?.filter((v) => v.metodo_pago === "tarjeta")
          .reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      const horaMap = Array(24).fill(0);
      ventas?.forEach((venta) => {
        if (!venta.fecha_venta) return;
        const hora = new Date(venta.fecha_venta).getHours();
        if (hora >= 0 && hora < 24) horaMap[hora] += venta.total || 0;
      });

      const ventasPorHora = [];
      let acumulado = 0;

      for (let h = 8; h <= 22; h++) {
        acumulado += horaMap[h];
        ventasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(acumulado),
        });
      }

      setEstadisticas({
        totalVentas,
        ventasEfectivo,
        ventasTarjeta,
        productosVendidos,
        montoProductos,
        cantidadVentas: ventas?.length || 0,
        ventasPorHora,
        ventasPorCategoria,
      });
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);
      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: ventas, error: errorVentas } = await supabase
        .from("ventas")
        .select(
          `
          id_venta,
          fecha_venta,
          total,
          metodo_pago,
          id_empleado,
          id_cliente
          `,
        )
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango)
        .order("fecha_venta", { ascending: false });

      if (errorVentas) throw errorVentas;

      const idsVentas = ventas?.map((v) => v.id_venta) || [];
      let detallesVenta = [];

      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(
            `
            id_detalle,
            id_venta,
            cantidad,
            precio_unitario,
            subtotal,
            id_producto,
            productos (
              nombre_producto,
              categorias (
                nombre_categoria
              )
            )
            `,
          )
          .in("id_venta", idsVentas)
          .order("id_venta");

        if (errorDetalles) console.error("Error en detalles:", errorDetalles);
        else detallesVenta = detalles || [];
      }

      const wb = XLSX.utils.book_new();

      if (ventas && ventas.length > 0) {
        const wsVentas = XLSX.utils.json_to_sheet(ventas);
        XLSX.utils.book_append_sheet(wb, wsVentas, "Ventas");
      } else {
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet([
            { Mensaje: "No hay ventas en este rango" },
          ]),
          "Ventas",
        );
      }

      if (detallesVenta && detallesVenta.length > 0) {
        const detallesExcel = detallesVenta.map((d) => ({
          id_detalle: d.id_detalle,
          id_venta: d.id_venta,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal,
          id_producto: d.id_producto,
          producto: d.productos?.nombre_producto || "Sin producto",
          categoria:
            d.productos?.categorias?.nombre_categoria || "Sin categoría",
        }));

        const wsDetalles = XLSX.utils.json_to_sheet(detallesExcel);
        XLSX.utils.book_append_sheet(wb, wsDetalles, "Detalles_Ventas");
      } else {
        XLSX.utils.book_append_sheet(
          wb,
          XLSX.utils.json_to_sheet([{ Mensaje: "No hay detalles de ventas" }]),
          "Detalles_Ventas",
        );
      }

      XLSX.writeFile(wb, `Reporte_Ventas_${fechaDesde}_a_${fechaHasta}.xlsx`);
    } catch (err) {
      console.error("Error generando Excel: ", err);
      alert("Error al generar el Excel. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  const COLORES = [
    "#5e26b2",
    "#39ff95",
    "#ff6bc6",
    "#8b46ff",
    "#00d4ff",
    "#ffd93d",
  ];

  if (cargando) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Cargando estadísticas...</p>
      </Container>
    );
  }

  return (
    <div className="mt-2">
      <div className="mt-4">
        <h2>Dashboard</h2>
        <h6>Estadísticas del Negocio</h6>
      </div>
      <Row className="mb-4">
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Desde</Form.Label>
            <Form.Control
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end gap-2">
          <Button variant="success" onClick={descargarExcel}>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Descargar Excel
          </Button>
          <Button variant="danger" onClick={generarPdfGeneral}>
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Descargar PDF General
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{ background: "linear-gradient(135deg, #28a745, #34ce57)" }}
          >
            <Card.Body>
              <h5>Ventas Totales</h5>
              <h2>C$ {estadisticas.totalVentas.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{ background: "linear-gradient(135deg, #0166d3, #3399ff)" }}
          >
            <Card.Body>
              <h5>Efectivo</h5>
              <h2>C$ {estadisticas.ventasEfectivo.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{ background: "linear-gradient(135deg, #5ea5f1, #94c0ec)" }}
          >
            <Card.Body>
              <h5>Tarjeta</h5>
              <h2>C$ {estadisticas.ventasTarjeta.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card
            className="h-100 text-white shadow"
            style={{ background: "linear-gradient(135deg, #e27d01, #ffa500)" }}
          >
            <Card.Body>
              <h5>Productos Vendidos</h5>
              <h2>{estadisticas.productosVendidos}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Body ref={graficoHoraRef}>
              <h5 className="mb-3">Ventas por Hora</h5>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={estadisticas.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis tickFormatter={(v) => `C$${v}`} />
                  <Tooltip formatter={(v) => [`C$ ${v}`, "Monto"]} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#5e26b2"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
            <div className="p-3 text-center">
              <Button
                variant="outline-danger"
                onClick={generarPdfVentasHora}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Descargar PDF
              </Button>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow border-0">
            <Card.Body ref={graficoCategoriaRef}>
              <h5 className="mb-3">Ventas por Categoría</h5>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={
                      estadisticas.ventasPorCategoria.length > 0
                        ? estadisticas.ventasPorCategoria
                        : [{ name: "Sin datos", value: 1 }]
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    label
                  >
                    {estadisticas.ventasPorCategoria.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORES[i % COLORES.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `C$ ${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
            <div className="p-3 text-center">
              <Button
                variant="outline-danger"
                onClick={generarPdfVentasCategoria}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Descargar PDF
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Inicio;
