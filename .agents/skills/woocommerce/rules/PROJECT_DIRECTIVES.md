# Directivas de Proyecto: WooCommerce Headless con React & Antigravity

## 1. Identidad y Propósito
Este proyecto consiste en el desarrollo de una aplicación Frontend desacoplada (Headless) utilizando React para la interfaz de usuario y WordPress/WooCommerce como motor de Backend. El objetivo es proporcionar una experiencia de compra ultra rápida, moderna y fluida.

## 2. Stack Tecnológico Obligatorio
- **Frontend:** React (Vite) con Hooks funcionales.
- **Estilos:** Tailwind CSS (Diseño Mobile-First).
- **Iconografía:** Lucide-react.
- **Gestión de Estado:** React Context API para el Carrito; TanStack Query (React Query) para sincronización con la API.
- **Comunicación API:** Cliente Axios configurado para la REST API de WooCommerce (v3) y soporte para WPGraphQL si es requerido.
- **Routing:** React Router DOM (v6+).

## 3. Estándares de Desarrollo
- **Estructura de Carpetas:** Basada en funciones (Features). Ej: `src/features/cart`, `src/features/products`, `src/components/ui`.
- **Componentes:** Deben ser atómicos, reutilizables y recibir datos mediante props.
- **Naming Convention:** PascalCase para componentes (`ProductCard.jsx`), camelCase para funciones y variables (`addToCart`).
- **Clean Code:** Funciones de una sola responsabilidad. Prohibido el uso de "Magic Numbers"; usar constantes para configuraciones.

## 4. Lógica de WooCommerce Headless
- **Persistencia de Sesión:** Es crítico manejar el header `woocommerce-session`. El agente debe implementar una lógica que almacene este token en `localStorage` para mantener el carrito activo tras recargas.
- **Sincronización:** Cada acción en el frontend (añadir/quitar producto) debe disparar una actualización silenciosa al backend de WooCommerce para asegurar que el inventario y los totales sean reales.
- **Seguridad:** Las API Keys deben leerse exclusivamente de variables de entorno (`.env`). Nunca hardcodear `ck_` o `cs_` en los componentes.

## 5. Instrucciones para el Agente (Comportamiento)
- **Validación Previa:** Antes de escribir código de UI, el agente debe usar el `woocommerce-mcp` para verificar la existencia de productos y la estructura de los datos.
- **Generación de Código:** Siempre proporcionar código completo y listo para producción, incluyendo manejo de estados de carga (`loading`) y errores (`error boundaries`).
- **Uso de Artifacts:** El agente debe presentar componentes complejos o layouts completos como "Artifacts" para facilitar la previsualización y descarga.
- **Proactividad:** Si el agente detecta un posible conflicto de CORS o una versión de API obsoleta, debe notificarlo inmediatamente antes de proceder con la ejecución.

## 6. Flujo de Trabajo (Workflow)
1. **Consulta:** El agente lee el estado actual del backend vía MCP.
2. **Propuesta:** El agente describe la lógica del componente antes de escribirlo.
3. **Escritura:** Generación de archivos en el sistema de archivos del proyecto.
4. **Prueba:** Verificación de la funcionalidad mediante el Browser integrado de Antigravity.