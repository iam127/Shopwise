CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'cliente'
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  categoria_id INT REFERENCES categorias(id),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  imagen_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS carritos (
  id SERIAL PRIMARY KEY,
  usuario_id INT UNIQUE REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS items_carrito (
  id SERIAL PRIMARY KEY,
  carrito_id INT REFERENCES carritos(id),
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  pedido_id INT UNIQUE REFERENCES pedidos(id),
  monto DECIMAL(10,2) NOT NULL,
  metodo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT NOW()
);
-- Newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT true
);

-- Contacto
CREATE TABLE IF NOT EXISTS contacto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  asunto VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'consulta',
  leido BOOLEAN DEFAULT false,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  producto_id INT REFERENCES productos(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id)
);