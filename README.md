# FOTAZA 2 - Red social de fotografias

Trabajo Practico Integrador (TPI) de Programacion Web II.
Tecnicatura en Desarrollo de Software - Universidad de La Punta (ULP).

## Descripcion

Red social donde los usuarios publican fotos, comentan, valoran,
siguen a otros, denuncian contenido y se contactan por mensajeria privada.

## Stack

- Node.js + Express 5
- PostgreSQL con Sequelize 6
- PUG (vistas renderizadas en servidor)
- bcryptjs, express-session, Multer, Zod

## Instalacion y despliegue local

1. Clonar el repositorio
   git clone https://github.com/owengmz/Fotaza-2.git
   cd Fotaza-2

2. Instalar dependencias
   npm install

3. Configurar variables de entorno
   Copiar .env.example a .env y completar los valores:
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=fotaza
   SESSION_SECRET=una_clave_secreta_larga

4. Inicializar la base de datos
   npm run db:init

5. Cargar datos de prueba (opcional)
   npm run db:seed

6. Iniciar la aplicacion
   npm start

La app queda disponible en http://localhost:3000

## Usuarios de prueba

| Email                | Password | Rol       |
| -------------------- | -------- | --------- |
| admin@fotaza.com     | test1234 | admin     |
| validador@fotaza.com | test1234 | validador |
| usuario@fotaza.com   | test1234 | usuario   |

## URL de produccion

https://fotaza-2-jpeo.onrender.com

## Funcionalidades

- Registro e inicio de sesion con hash de password (bcryptjs)
- Publicaciones con multiples imagenes, etiquetas y licencia
- Marca de agua obligatoria para imagenes con copyright
- Usuarios anonimos solo ven imagenes sin copyright
- Comentarios con opcion de cierre por el autor
- Comentarios en publicaciones, con notificacion al autor
- Valoracion de 1 a 5 por imagen (el autor no puede valorar la propia)- Me interesa con notificacion al autor
- Seguir y dejar de seguir usuarios
- Notificaciones de comentarios, valoraciones, me interesa y nuevos seguidores
- Denuncias de imagenes y comentarios con motivo y descripcion
- Publicacion con 3 o mas denuncias pasa a revision automaticamente
- Panel del validador para bajar o desestimar publicaciones denunciadas
- 3 publicaciones bajadas desactiva la cuenta del autor
- Colecciones privadas de publicaciones favoritas
- Buscador con filtros combinables por titulo, autor, etiqueta y licencia
- Mensajeria privada entre usuarios

## Problemas encontrados y soluciones

- bcrypt falla al deployar en Render: se uso bcryptjs como reemplazo
- express.static con ruta relativa no resuelve en Render: se uso
  fileURLToPath y join para construir la ruta absoluta
- res.redirect('back') genera URLs literales "back": se reemplazo
  siempre por rutas explicitas
- Sequelize no mapea FKs en snake_case sin field:: se agrego field:
  explicito en cada campo de nombre compuesto en todos los modelos
- Zod 4 usa resultado.error.issues en lugar de resultado.error.errors
- Render no soporta variables de entorno en .env: se configuro en el panel
  de Render y se agrego un mensaje de error claro si faltan variables
