
# 🏋️‍♂️ TitanGym Management System

TitanGym es una plataforma integral de gestión para gimnasios de alto rendimiento, diseñada para ser rápida, responsiva y potenciada por Inteligencia Artificial (Google Gemini).

## ✨ Características Principales

- **Gestión de Atletas**: Registro de miembros con planes de mensualidad (Básico, Pro, VIP).
- **Control de Staff**: Administración de empleados y roles (Admin, Trainer, Recepción).
- **Asistencia con Geolocalización**: Registro de entradas y salidas validando la ubicación real.
- **AI Business Insights**: Análisis automático de sugerencias de clientes mediante Google Gemini API.
- **Diseño Responsivo**: Adaptado para móviles, tablets y escritorio.
- **Persistencia Local**: Datos guardados automáticamente en el navegador.

## 🚀 Cómo empezar (Local)

Simplemente abre el archivo `index.html` en un navegador moderno o usa un servidor local como "Live Server".

## 🐳 Despliegue con Docker

Este proyecto está listo para ser levantado con contenedores:

```bash
# Construir y levantar el frontend y la base de datos
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`.

## 📦 Cómo subir este proyecto a GitHub

Para guardar este proyecto en tu cuenta de GitHub, sigue estos pasos:

1. **Crea un repositorio vacío en GitHub** (no marques la opción de añadir README ni .gitignore).
2. **Abre tu terminal** en la carpeta de este proyecto y ejecuta:

```bash
# Inicializar el repositorio local
git init

# Añadir todos los archivos
git add .

# Crear el primer commit
git commit -m "Initial commit: TitanGym Management System ready"

# Conectar con tu repositorio (reemplaza con tu URL)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git

# Subir los archivos
git push -u origin main
```

## 🔐 Configuración de API KEY

Para que las funciones de IA funcionen, asegúrate de tener una variable de entorno `API_KEY` configurada con tu llave de Google AI Studio.

---
Desarrollado con ❤️ para gimnasios del futuro.
