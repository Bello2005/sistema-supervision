# Sistema de Supervisión y Gestión de Evidencias

## Resolución N° 215 de 2025
### Resguardo Indígena Catrú, Dubasa y Ancósó

---

## Resumen Ejecutivo

Sistema integral de supervisión en tiempo real diseñado para la gestión, registro y monitoreo de evidencias, eventos de capacitación y procesos formativos. Plataforma web completa con arquitectura cliente-servidor que proporciona herramientas avanzadas para la administración documental, seguimiento de actividades y supervisión remota de eventos.

---

## Descripción del Sistema

El Sistema de Supervisión es una solución tecnológica empresarial que facilita la gestión integral de evidencias y eventos de capacitación mediante una interfaz web moderna y una API REST robusta. El sistema permite la captura, almacenamiento, organización y análisis de evidencias documentales, fotográficas y audiovisuales, así como la administración completa del ciclo de vida de eventos formativos.

### Capacidades Principales

**Gestión de Evidencias**
- Carga y administración de archivos multimedia (imágenes, videos, documentos)
- Sistema de categorización y etiquetado avanzado
- Geolocalización de evidencias
- Almacenamiento seguro en servidor con gestión de metadatos
- Exportación de registros en múltiples formatos

**Administración de Eventos**
- Gestión completa del ciclo de vida de eventos de capacitación
- Calendario interactivo con visualización de eventos programados
- Sistema de gestión de participantes
- Seguimiento de estados (Programado, En curso, Completado)
- Integración con plataformas de videoconferencia

**Supervisión en Tiempo Real**
- Monitoreo simultáneo de múltiples transmisiones
- Integración con plataformas de reunión (Jitsi, Google Meet, Zoom, Microsoft Teams, Webex, GoToMeeting)
- Indicadores de estado en vivo
- Métricas de calidad de transmisión

**Análisis y Reportes**
- Dashboard ejecutivo con métricas en tiempo real
- Estadísticas de participación y asistencia
- Generación de reportes exportables
- Visualización de tendencias y análisis de datos

---

## Arquitectura Técnica

### Stack Tecnológico

**Frontend**
- HTML5 (Estructura semántica y accesibilidad)
- Tailwind CSS 3.x (Framework de diseño utilitario)
- Alpine.js (Framework JavaScript reactivo y ligero)
- Font Awesome 6.x (Biblioteca de iconografía)
- Google Fonts - Inter (Tipografía corporativa)

**Backend**
- Node.js 18+ LTS (Runtime de JavaScript)
- Express.js 4.x (Framework web para API REST)
- PostgreSQL 15 (Sistema de gestión de bases de datos relacional)
- JSON Web Tokens (JWT) - Autenticación basada en tokens
- Bcrypt - Algoritmo de hash para contraseñas
- Multer - Middleware para manejo de carga de archivos
- Express Validator - Validación y sanitización de datos de entrada

**Infraestructura**
- Docker & Docker Compose - Containerización y orquestación
- Nginx - Servidor web y proxy reverso

### Arquitectura de Datos

El sistema utiliza una arquitectura de base de datos relacional con las siguientes entidades principales:

- **Users**: Gestión de usuarios y autenticación
- **Events**: Eventos de capacitación y procesos formativos
- **Evidences**: Registro de evidencias documentales
- **Event Participants**: Relación muchos-a-muchos entre eventos y participantes
- **Evidence Files**: Archivos asociados a evidencias

---

## Estructura del Proyecto

```
mockup/
├── frontend/
│   ├── index.html                      # Dashboard principal
│   ├── registro-evidencias.html        # Módulo de registro de evidencias
│   ├── listados.html                   # Listados y registros entregables
│   ├── supervision-tiempo-real.html    # Supervisión en tiempo real
│   ├── eventos-capacitacion.html       # Gestión de eventos
│   ├── login.html                      # Autenticación de usuarios
│   ├── ayuda.html                      # Centro de ayuda y soporte
│   ├── configuracion.html              # Configuración del sistema
│   └── js/
│       └── api.js                      # Cliente API para comunicación con backend
├── backend/
│   ├── src/
│   │   ├── server.js                   # Servidor Express principal
│   │   ├── controllers/                # Lógica de negocio (Auth, Events, Evidences)
│   │   ├── models/                     # Modelos de datos (User, Event, Evidence)
│   │   ├── routes/                     # Definición de rutas API
│   │   ├── middlewares/                # Middlewares (Auth, Upload, Validator)
│   │   ├── config/                     # Configuración de base de datos
│   │   └── database/                   # Schema, migraciones y seeds
│   ├── uploads/                        # Almacenamiento de archivos subidos
│   ├── package.json                    # Dependencias y scripts
│   └── Dockerfile                      # Configuración de contenedor Docker
├── docker-compose.yml                  # Orquestación de servicios
├── nginx.conf                         # Configuración de servidor web
└── README.md                          # Documentación del proyecto
```

---

## Instalación y Configuración

### Requisitos del Sistema

- Node.js 18.0.0 o superior
- PostgreSQL 15.0 o superior
- Docker 20.10+ y Docker Compose 2.0+ (opcional, para instalación containerizada)
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Instalación mediante Docker (Recomendado)

La instalación mediante Docker proporciona un entorno aislado y reproducible:

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd mockup

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con las credenciales apropiadas

# 3. Iniciar servicios
docker-compose up -d

# 4. Ejecutar migraciones de base de datos
docker-compose exec backend npm run migrate

# 5. Cargar datos iniciales (opcional)
docker-compose exec backend npm run seed
```

El sistema estará disponible en:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`

### Instalación Manual

#### Configuración del Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run migrate
npm run seed
npm run dev
```

#### Configuración del Frontend

```bash
cd frontend
# Opción 1: Servidor HTTP de Python
python -m http.server 8080

# Opción 2: Servidor HTTP de Node.js
npx http-server -p 8080
```

### Variables de Entorno

El archivo `.env` del backend debe contener las siguientes variables:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supervision_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_segura

# Autenticación JWT
JWT_SECRET=tu_secret_key_muy_segura_minimo_32_caracteres
JWT_EXPIRES_IN=7d

# Servidor
NODE_ENV=development
PORT=3000

# CORS
FRONTEND_URL=http://localhost:8080
```

### Credenciales de Acceso Inicial

**Importante**: El sistema restringe el acceso únicamente a usuarios con rol de administrador.

- **Email**: `admin@supervision.com`
- **Contraseña**: `password123`

**Recomendación de Seguridad**: Cambiar la contraseña inmediatamente después de la primera autenticación.

---

## Documentación de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de nuevos usuarios (requiere permisos de administrador) |
| POST | `/api/auth/login` | Autenticación de usuarios (solo administradores) |
| GET | `/api/auth/profile` | Obtener perfil del usuario autenticado |
| PUT | `/api/auth/profile` | Actualizar perfil del usuario |
| GET | `/api/auth/users` | Listar usuarios del sistema |

### Gestión de Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/events` | Listar eventos con filtros opcionales |
| GET | `/api/events/:id` | Obtener detalles de un evento específico |
| POST | `/api/events` | Crear nuevo evento |
| PUT | `/api/events/:id` | Actualizar evento existente |
| DELETE | `/api/events/:id` | Eliminar evento |
| GET | `/api/events/stats` | Obtener estadísticas de eventos |
| GET | `/api/events/upcoming` | Listar próximos eventos |
| POST | `/api/events/:id/participants` | Agregar participante a evento |
| GET | `/api/events/:id/participants` | Listar participantes de un evento |

### Gestión de Evidencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/evidences` | Listar evidencias con filtros opcionales |
| GET | `/api/evidences/:id` | Obtener detalles de una evidencia específica |
| POST | `/api/evidences` | Crear nueva evidencia (con archivos) |
| PUT | `/api/evidences/:id` | Actualizar evidencia existente |
| DELETE | `/api/evidences/:id` | Eliminar evidencia |
| GET | `/api/evidences/stats` | Obtener estadísticas de evidencias |
| GET | `/api/evidences/recent` | Listar evidencias recientes |
| GET | `/api/evidences/:evidenceId/files/:fileId/download` | Descargar archivo asociado |
| DELETE | `/api/evidences/:evidenceId/files/:fileId` | Eliminar archivo asociado |

---

## Seguridad

### Mecanismos de Autenticación y Autorización

El sistema implementa un modelo de seguridad multicapa:

**Autenticación**
- Tokens JWT (JSON Web Tokens) para autenticación stateless
- Encriptación de contraseñas mediante Bcrypt con salt rounds
- Restricción de acceso exclusiva a usuarios con rol de administrador
- Expiración automática de tokens de sesión

**Autorización**
- Middleware de autenticación en todas las rutas protegidas
- Validación de permisos basada en roles de usuario
- Protección contra acceso no autorizado a recursos

**Validación de Datos**
- Validación y sanitización de entrada en servidor mediante Express Validator
- Prevención de inyección SQL mediante consultas parametrizadas
- Validación de tipos de archivo y tamaños máximos

**Configuración de Seguridad**
- CORS configurado para permitir solicitudes únicamente desde dominios autorizados
- Headers de seguridad HTTP
- Protección contra ataques de fuerza bruta

### Recomendaciones para Producción

- Implementar HTTPS mediante certificados SSL/TLS
- Configurar protección CSRF (Cross-Site Request Forgery)
- Implementar rate limiting para prevenir abuso de API
- Configurar logs de auditoría y monitoreo de seguridad
- Realizar backups regulares de la base de datos
- Mantener dependencias actualizadas para mitigar vulnerabilidades

---

## Funcionalidades Implementadas

### Backend

- [x] API REST completa con arquitectura Express.js
- [x] Sistema de autenticación JWT con restricción a administradores
- [x] Base de datos PostgreSQL con relaciones normalizadas y triggers
- [x] Operaciones CRUD completas para eventos y evidencias
- [x] Sistema de carga de archivos con validación y almacenamiento
- [x] Validación de datos en todas las rutas de API
- [x] Gestión de participantes en eventos
- [x] Sistema de estadísticas y reportes
- [x] Configuración de Docker y Docker Compose

### Frontend

- [x] Interfaz de usuario responsive y moderna
- [x] Navegación fluida entre módulos
- [x] Sidebar colapsable con funcionalidad de cierre de sesión
- [x] Sistema de autenticación con validación en cliente
- [x] Integración completa con API backend
- [x] Filtros y búsquedas en tiempo real
- [x] Modales interactivos para operaciones CRUD
- [x] Carga de archivos con vista previa
- [x] Calendario interactivo conectado a base de datos
- [x] Gestión de participantes en eventos
- [x] Sistema de notificaciones mediante toasts
- [x] Diseño responsive para dispositivos móviles, tablets y desktop
- [x] Soporte para múltiples plataformas de videoconferencia

### Características Avanzadas

- [x] Dashboard con métricas en tiempo real desde base de datos
- [x] Visualización dinámica de eventos en calendario
- [x] Cálculo preciso de estadísticas de participantes
- [x] Modales para visualización, edición, compartición y descarga de evidencias
- [x] Gestión completa de archivos (subida, descarga, eliminación)
- [x] Supervisión en tiempo real con enlaces de reunión
- [x] Centro de ayuda con funcionalidades de contacto

---

## Compatibilidad

### Navegadores Soportados

- Google Chrome 90 o superior
- Mozilla Firefox 88 o superior
- Apple Safari 14 o superior
- Microsoft Edge 90 o superior

### Dispositivos

- Desktop (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

---

## Comandos de Desarrollo

### Docker

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Reiniciar servicio backend
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (incluyendo base de datos)
docker-compose down -v

# Acceder a la base de datos PostgreSQL
docker-compose exec postgres psql -U postgres -d supervision_db
```

### Base de Datos

```bash
# Ejecutar migraciones
npm run migrate

# Cargar datos iniciales
npm run seed

# Revertir última migración
npm run migrate:rollback
```

---

## Roadmap de Desarrollo

### Versión 2.1 - Mejoras Incrementales
- Notificaciones push en tiempo real
- Exportación avanzada de reportes (PDF, Excel con formato personalizado)
- Búsqueda avanzada con filtros múltiples y combinados
- Personalización de dashboard por usuario

### Versión 3.0 - Funcionalidades Avanzadas
- Streaming de video en tiempo real (WebRTC/HLS)
- Aplicación móvil nativa (iOS/Android)
- Modo offline con sincronización automática
- Reportes avanzados con gráficos interactivos y análisis predictivo
- Integración con servicios de almacenamiento en la nube (AWS S3, Azure Blob Storage)

---

## Contribución

Este proyecto sigue estándares de desarrollo profesional. Para contribuir:

1. Realizar fork del repositorio
2. Crear una rama de feature (`git checkout -b feature/nombre-funcionalidad`)
3. Realizar commits descriptivos siguiendo convenciones de mensajes
4. Enviar pull request con descripción detallada de los cambios

### Estándares de Código

- Seguir convenciones de nomenclatura establecidas
- Incluir comentarios en código complejo
- Mantener cobertura de tests adecuada
- Actualizar documentación según corresponda

---

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consultar el archivo `LICENSE` para más detalles.

---

## Información del Proyecto

**Versión**: 2.0.0  
**Última Actualización**: Noviembre 2025  
**Estado**: Sistema Completo - Backend y Frontend Integrados - Listo para Producción

---

## Contacto y Soporte

Para consultas técnicas, reporte de problemas o solicitudes de funcionalidades:

- **Email**: [contacto@ejemplo.com]
- **Issues**: [GitHub Issues](https://github.com/usuario/repositorio/issues)

---

## Agradecimientos

Sistema desarrollado para el **Resguardo Indígena Catrú, Dubasa y Ancósó** bajo la **Resolución N° 215 de 2025**.

Desarrollado con tecnologías web modernas y estándares de código abierto.
