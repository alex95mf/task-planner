# Task Planner - Sistema de Gestión de Tareas

Este proyecto es un sistema de gestión de tareas. La aplicación permite a los usuarios crear, actualizar y eliminar tareas, y está compuesta por un frontend en **Angular** y un backend en **Java (Spring Boot)**.

## Estructura del Proyecto

El proyecto consta de dos componentes principales:

- **Frontend**: Una aplicación en Angular que permite gestionar las tareas de forma visual.
- **Backend**: Un API RESTful en Java (Spring Boot) que gestiona las operaciones relacionadas con las tareas.
- **Dockerización**: El proyecto está completamente dockerizado para facilitar el despliegue en diferentes entornos.

### Backend (Java - Spring Boot)

El backend proporciona una API RESTful con los siguientes endpoints:

- `GET /api/tasks`: Obtiene todas las tareas.
- `POST /api/tasks`: Crea una nueva tarea.
- `PUT /api/tasks/{id}`: Actualiza el estado de una tarea.
- `DELETE /api/tasks/{id}`: Elimina una tarea.

El backend usa una base de datos para almacenar las tareas, y se ha implementado una autenticación básica para proteger los endpoints.

### Frontend (Angular)

El frontend permite a los usuarios:

- Ver todas las tareas con sus detalles.
- Crear nuevas tareas.
- Actualizar el estado de las tareas.
- Eliminar tareas.

La interfaz está diseñada de manera sencilla para facilitar la interacción del usuario.

### Dockerización

El proyecto está completamente dockerizado utilizando los siguientes contenedores:

- **Backend**: Contenedor que ejecuta la API RESTful en Spring Boot.
- **Frontend**: Contenedor que ejecuta la aplicación Angular.
- **Base de Datos**: Contenedor de base de datos MySQL para almacenar las tareas.

### Despliegue

El proyecto está desplegado en una instancia EC2 de AWS en la capa gratuita. Para acceder a la aplicación y la API:

- **APP Web**: http://3.88.210.8:4200/login
- **API**: http://3.88.210.8:8080/swagger-ui/index.html

### Instrucciones de Ejecución Local

Para ejecutar el proyecto en tu máquina local, sigue estos pasos:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/alex95mf/task-planner.git
   ```
2. Navega a la carpeta del proyecto:

   ```bash
   cd task-planner
   ```
3. Ejecuta docker-compose para levantar los contenedores:

   ```bash
   docker-compose up -d --build
   ```

4. Accede a la aplicación en el navegador y a la API a través de los siguientes enlaces:

- **APP Web**: http://localhost:420
- **API**:  http://localhost:8080

### Pruebas
Se han implementado pruebas unitarias para cada operación tanto en el frontend como en el backend.

### Contacto
Para cualquier consulta o comentario, puedes contactarme directamente en:
- alex95mf@gmail.com
- +593 993414364

Gracias por revisar este proyecto!