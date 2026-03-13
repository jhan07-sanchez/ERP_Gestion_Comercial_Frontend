# 💻 ERP Gestión Comercial - Frontend (Vite + React)

Frontend moderno y responsivo para el sistema ERP, construido con React 19, TailwindCSS y Zustand.

## 🚀 Inicio Rápido

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar entorno:**
    El proyecto usa archivos `.env` según el modo:
    - `.env.development`: Apunta a `http://localhost:8000/api`
    - `.env.production`: Apunta a la URL de Render.

3.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📁 Estructura del Proyecto

- `src/core`: Configuración global, axios, constantes y stores de Zustand.
- `src/shared`: Componentes UI reutilizables (Botones, Inputs, Layouts).
- `src/modules`: Lógica de negocio dividida por dominios (Ventas, Productos, etc.).
- `src/assets`: Imágenes, iconos y estilos globales.

## 🛠️ Tecnologías Principales

- **Framework**: React 19 + TypeScript
- **Estilos**: TailwindCSS
- **Estado**: Zustand (Ligero y escalable)
- **Rutas**: React Router Dom v7
- **Gráficos**: Recharts
- **Iconos**: Tabler Icons

## 🌐 Configuración de API

Asegúrate de que la variable `VITE_API_URL` en tu archivo `.env` apunte a la instancia correcta del backend.

- **Local**: `http://localhost:8000/api`
- **Producción**: `https://tu-backend.onrender.com/api`
