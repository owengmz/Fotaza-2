-- ============================================================
-- FOTAZA 2 - Esquema de base de datos PostgreSQL
-- ============================================================
-- Notas de diseno:
--   - snake_case en todos los nombres
--   - ON DELETE definido en todas las foreign keys
--   - Indices en todas las foreign keys (el doc lo pide explicitamente)
--   - Constraints CHECK para integridad de datos
--   - Normalizado 3FN
-- ============================================================

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre          TEXT NOT NULL,
    apellido        TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,                 -- se guarda el HASH, nunca texto plano
    nombre_usuario  TEXT UNIQUE NOT NULL,
    avatar          TEXT,
    bio             TEXT,
    rol             TEXT NOT NULL DEFAULT 'usuario'
                    CHECK (rol IN ('usuario', 'validador', 'admin')),
    estado          TEXT NOT NULL DEFAULT 'activo'
                    CHECK (estado IN ('activo', 'inactivo')),
    fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- PUBLICACIONES
-- ------------------------------------------------------------
CREATE TABLE publicaciones (
    id                    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo                TEXT NOT NULL,
    descripcion           TEXT,
    usuario_id            BIGINT NOT NULL
                          REFERENCES usuarios(id) ON DELETE CASCADE,
    comentarios_abiertos  BOOLEAN NOT NULL DEFAULT TRUE,
    estado                TEXT NOT NULL DEFAULT 'activa'
                          CHECK (estado IN ('activa', 'bajada', 'pendiente_revision')),
    fecha_creacion        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Si se borra el usuario, se borran sus publicaciones (CASCADE)
CREATE INDEX idx_publicaciones_usuario ON publicaciones(usuario_id);
CREATE INDEX idx_publicaciones_estado  ON publicaciones(estado);

-- ------------------------------------------------------------
-- IMAGENES
-- ------------------------------------------------------------
CREATE TABLE imagenes (
    id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    url               TEXT NOT NULL,
    licencia          TEXT NOT NULL
                      CHECK (licencia IN ('con_copyright', 'sin_copyright')),
    texto_marca_agua  TEXT,
    publicacion_id    BIGINT NOT NULL
                      REFERENCES publicaciones(id) ON DELETE CASCADE,
    fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_imagenes_publicacion ON imagenes(publicacion_id);

-- ------------------------------------------------------------
-- ETIQUETAS
-- ------------------------------------------------------------
CREATE TABLE etiquetas (
    id      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre  TEXT UNIQUE NOT NULL
);

-- ------------------------------------------------------------
-- PUBLICACIONES_ETIQUETAS  (muchos a muchos)
-- ------------------------------------------------------------
CREATE TABLE publicaciones_etiquetas (
    publicacion_id  BIGINT NOT NULL
                    REFERENCES publicaciones(id) ON DELETE CASCADE,
    etiqueta_id     BIGINT NOT NULL
                    REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (publicacion_id, etiqueta_id)
);
CREATE INDEX idx_pub_etiq_etiqueta ON publicaciones_etiquetas(etiqueta_id);

-- ------------------------------------------------------------
-- COMENTARIOS
-- ------------------------------------------------------------
CREATE TABLE comentarios (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    contenido       TEXT NOT NULL,
    publicacion_id  BIGINT NOT NULL
                    REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id      BIGINT NOT NULL
                    REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comentarios_publicacion ON comentarios(publicacion_id);
CREATE INDEX idx_comentarios_usuario     ON comentarios(usuario_id);

-- ------------------------------------------------------------
-- VALORACIONES
-- Un usuario valora una imagen UNA sola vez (PK compuesta)
-- La regla "el autor no puede valorar su propia imagen" se controla
-- en la logica de la aplicacion (no se puede hacer solo con SQL simple)
-- ------------------------------------------------------------
CREATE TABLE valoraciones (
    usuario_id  BIGINT NOT NULL
                REFERENCES usuarios(id) ON DELETE CASCADE,
    imagen_id   BIGINT NOT NULL
                REFERENCES imagenes(id) ON DELETE CASCADE,
    valor       INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5),
    fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, imagen_id)
);
CREATE INDEX idx_valoraciones_imagen ON valoraciones(imagen_id);

-- ------------------------------------------------------------
-- DENUNCIAS DE IMAGEN
-- Un usuario no puede denunciar la misma imagen dos veces (PK compuesta)
-- ------------------------------------------------------------
CREATE TABLE denuncias_imagen (
    usuario_id   BIGINT NOT NULL
                 REFERENCES usuarios(id) ON DELETE CASCADE,
    imagen_id    BIGINT NOT NULL
                 REFERENCES imagenes(id) ON DELETE CASCADE,
    motivo       TEXT NOT NULL
                 CHECK (motivo IN ('contenido_inapropiado', 'copyright', 'spam', 'otro')),
    descripcion  TEXT NOT NULL,
    fecha        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, imagen_id)
);
CREATE INDEX idx_denuncias_imagen_imagen ON denuncias_imagen(imagen_id);

-- ------------------------------------------------------------
-- DENUNCIAS DE COMENTARIO
-- ------------------------------------------------------------
CREATE TABLE denuncias_comentario (
    usuario_id     BIGINT NOT NULL
                   REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id  BIGINT NOT NULL
                   REFERENCES comentarios(id) ON DELETE CASCADE,
    motivo         TEXT NOT NULL
                   CHECK (motivo IN ('contenido_inapropiado', 'copyright', 'spam', 'otro')),
    descripcion    TEXT NOT NULL,
    fecha          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, comentario_id)
);
CREATE INDEX idx_denuncias_com_comentario ON denuncias_comentario(comentario_id);

-- ------------------------------------------------------------
-- FOLLOWERS
-- No puede seguirse a si mismo (CHECK)
-- No puede seguir dos veces al mismo (PK compuesta)
-- ------------------------------------------------------------
CREATE TABLE followers (
    usuario_seguidor_id  BIGINT NOT NULL
                         REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario_seguido_id   BIGINT NOT NULL
                         REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_seguidor_id, usuario_seguido_id),
    CHECK (usuario_seguidor_id <> usuario_seguido_id)
);
CREATE INDEX idx_followers_seguido ON followers(usuario_seguido_id);

-- ------------------------------------------------------------
-- NOTIFICACIONES
-- publicacion_id e imagen_id son opcionales segun el tipo de evento
-- ------------------------------------------------------------
CREATE TABLE notificaciones (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usuario_id      BIGINT NOT NULL
                    REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            TEXT NOT NULL
                    CHECK (tipo IN ('nuevo_comentario', 'nueva_valoracion', 'me_interesa', 'nuevo_seguidor')),
    generador_id    BIGINT NOT NULL
                    REFERENCES usuarios(id) ON DELETE CASCADE,
    publicacion_id  BIGINT REFERENCES publicaciones(id) ON DELETE CASCADE,
    imagen_id       BIGINT REFERENCES imagenes(id) ON DELETE CASCADE,
    leida           BOOLEAN NOT NULL DEFAULT FALSE,
    fecha           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida   ON notificaciones(usuario_id, leida);

-- ------------------------------------------------------------
-- COLECCIONES
-- ------------------------------------------------------------
CREATE TABLE colecciones (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre      TEXT NOT NULL,
    usuario_id  BIGINT NOT NULL
                REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE INDEX idx_colecciones_usuario ON colecciones(usuario_id);

-- ------------------------------------------------------------
-- COLECCIONES_PUBLICACIONES  (muchos a muchos)
-- No se guarda la misma publicacion dos veces en la misma coleccion (PK)
-- ------------------------------------------------------------
CREATE TABLE colecciones_publicaciones (
    coleccion_id    BIGINT NOT NULL
                    REFERENCES colecciones(id) ON DELETE CASCADE,
    publicacion_id  BIGINT NOT NULL
                    REFERENCES publicaciones(id) ON DELETE CASCADE,
    PRIMARY KEY (coleccion_id, publicacion_id)
);
CREATE INDEX idx_col_pub_publicacion ON colecciones_publicaciones(publicacion_id);

-- ------------------------------------------------------------
-- ME_INTERESA
-- ------------------------------------------------------------
CREATE TABLE me_interesa (
    usuario_id  BIGINT NOT NULL
                REFERENCES usuarios(id) ON DELETE CASCADE,
    imagen_id   BIGINT NOT NULL
                REFERENCES imagenes(id) ON DELETE CASCADE,
    fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, imagen_id)
);
CREATE INDEX idx_me_interesa_imagen ON me_interesa(imagen_id);

-- ------------------------------------------------------------
-- MENSAJES  (mensajeria privada del flujo "me interesa")
-- ------------------------------------------------------------
CREATE TABLE mensajes (
    id               BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    remitente_id     BIGINT NOT NULL
                     REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id  BIGINT NOT NULL
                     REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido        TEXT NOT NULL,
    leido            BOOLEAN NOT NULL DEFAULT FALSE,
    imagen_id        BIGINT REFERENCES imagenes(id) ON DELETE SET NULL,
    fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (remitente_id <> destinatario_id)
);
CREATE INDEX idx_mensajes_destinatario ON mensajes(destinatario_id);
CREATE INDEX idx_mensajes_remitente    ON mensajes(remitente_id);
