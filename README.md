[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l2PpCgMp)
# Analytics Dashboard — Infusio

Aplicación **Analytics Dashboard** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `INFUSIO`.

Esta aplicación es desarrollada por dos integrantes de la comisión Infusio: **Emalhao Lautaro** y **Vives María de los Milagros**.

**Deploy:** https://etapa-3-analytics-dashboard-infusio.vercel.app/

---

## Descripción

El Analytics Dashboard es una herramienta de reportes consolidados que centraliza y visualiza métricas del sistema completo del ecosistema Infusio. La aplicación consulta las APIs de las cuatro webapps individuales del proyecto (Buyer, Seller, Payments y Shipping) y presenta los datos de forma unificada en un panel de administración.

### Funcionalidades principales

- **Dashboard principal:** muestra indicadores clave (KPIs) como ingresos totales, usuarios totales, pedidos confirmados, productos listados, tasa de entrega y tasa de conversión de pagos.
- **Visualizaciones:** gráficos interactivos de ingresos diarios, distribución de estados de pedidos (pie chart), ingresos mensuales e ingresos semanales, construidos con Recharts.
- **Secciones por app:** páginas dedicadas para explorar datos de Pedidos, Productos, Pagos, Envíos y Usuarios, consultando cada API del ecosistema.
- **Infusio Insights:** un módulo de análisis cruzado de las 4 apps del ecosistema que utiliza inteligencia artificial (Groq) para generar conclusiones y recomendaciones a partir de los datos consolidados.
- **Exportación:** posibilidad de exportar reportes en PDF.
- **Autenticación y autorización:** login mediante Clerk, con control de acceso por roles (solo administradores pueden acceder al dashboard).

### Tecnologías utilizadas

- **Next.js 16** con App Router y Turbopack
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Clerk** para autenticación y gestión de usuarios
- **Recharts** para gráficos interactivos
- **Groq SDK** para análisis con IA
- **@react-pdf/renderer** para generación de PDFs
- Desplegado en **Vercel**

---

## Acceso

| Rol           | Email               | Contraseña    |
|---------------|---------------------|---------------|
| Administrador | admin@infusio.com   | Infusio2024!  |

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
