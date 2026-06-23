--
-- PostgreSQL database dump
--

\restrict HkjGOc3xJmbjJe8OseY3kuZC7pdC0hzh3k2gqDrdNkX0xhzAjdCd55STikjspco

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carritos (
    id integer NOT NULL,
    usuario_id integer
);


ALTER TABLE public.carritos OWNER TO postgres;

--
-- Name: carritos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carritos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carritos_id_seq OWNER TO postgres;

--
-- Name: carritos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carritos_id_seq OWNED BY public.carritos.id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: contacto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacto (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    asunto character varying(255) NOT NULL,
    mensaje text NOT NULL,
    tipo character varying(50) DEFAULT 'consulta'::character varying,
    leido boolean DEFAULT false,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    respuesta text,
    respondido_en timestamp without time zone
);


ALTER TABLE public.contacto OWNER TO postgres;

--
-- Name: contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacto_id_seq OWNER TO postgres;

--
-- Name: contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacto_id_seq OWNED BY public.contacto.id;


--
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    id integer NOT NULL,
    usuario_id integer,
    producto_id integer
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- Name: favoritos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favoritos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favoritos_id_seq OWNER TO postgres;

--
-- Name: favoritos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_id_seq OWNED BY public.favoritos.id;


--
-- Name: items_carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_carrito (
    id integer NOT NULL,
    carrito_id integer,
    producto_id integer,
    cantidad integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.items_carrito OWNER TO postgres;

--
-- Name: items_carrito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_carrito_id_seq OWNER TO postgres;

--
-- Name: items_carrito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_carrito_id_seq OWNED BY public.items_carrito.id;


--
-- Name: items_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_pedido (
    id integer NOT NULL,
    pedido_id integer,
    producto_id integer,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL
);


ALTER TABLE public.items_pedido OWNER TO postgres;

--
-- Name: items_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_pedido_id_seq OWNER TO postgres;

--
-- Name: items_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_pedido_id_seq OWNED BY public.items_pedido.id;


--
-- Name: newsletter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newsletter (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    fecha_suscripcion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);


ALTER TABLE public.newsletter OWNER TO postgres;

--
-- Name: newsletter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.newsletter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.newsletter_id_seq OWNER TO postgres;

--
-- Name: newsletter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.newsletter_id_seq OWNED BY public.newsletter.id;


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    pedido_id integer,
    monto numeric(10,2) NOT NULL,
    metodo character varying(50),
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    usuario_id integer,
    total numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    creado_en timestamp without time zone DEFAULT now(),
    costo_envio numeric(10,2) DEFAULT 0,
    subtotal numeric(10,2) DEFAULT 0
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_seq OWNER TO postgres;

--
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    categoria_id integer,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    imagen_url character varying(255),
    activo boolean DEFAULT true,
    descuento integer DEFAULT 0,
    oferta_fin timestamp without time zone,
    CONSTRAINT productos_descuento_check CHECK (((descuento >= 0) AND (descuento <= 90)))
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    usuario_id integer,
    producto_id integer,
    rating integer,
    comentario text,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: testimonios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testimonios (
    id integer NOT NULL,
    usuario_id integer,
    texto text NOT NULL,
    rating integer NOT NULL,
    aprobado boolean DEFAULT false,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT testimonios_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.testimonios OWNER TO postgres;

--
-- Name: testimonios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.testimonios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonios_id_seq OWNER TO postgres;

--
-- Name: testimonios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.testimonios_id_seq OWNED BY public.testimonios.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'cliente'::character varying,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telefono character varying(20),
    direccion text
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: carritos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carritos ALTER COLUMN id SET DEFAULT nextval('public.carritos_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: contacto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto ALTER COLUMN id SET DEFAULT nextval('public.contacto_id_seq'::regclass);


--
-- Name: favoritos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id SET DEFAULT nextval('public.favoritos_id_seq'::regclass);


--
-- Name: items_carrito id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito ALTER COLUMN id SET DEFAULT nextval('public.items_carrito_id_seq'::regclass);


--
-- Name: items_pedido id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido ALTER COLUMN id SET DEFAULT nextval('public.items_pedido_id_seq'::regclass);


--
-- Name: newsletter id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter ALTER COLUMN id SET DEFAULT nextval('public.newsletter_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: testimonios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonios ALTER COLUMN id SET DEFAULT nextval('public.testimonios_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: carritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carritos (id, usuario_id) FROM stdin;
1	1
2	2
3	3
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nombre) FROM stdin;
1	Electronica
2	Ropa
3	Hogar
\.


--
-- Data for Name: contacto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacto (id, nombre, email, asunto, mensaje, tipo, leido, fecha, respuesta, respondido_en) FROM stdin;
1	Matias Galvan Guerrero	matias.galvan@tecsup.edu.pe	Nada	Nada	consulta	t	2026-06-19 20:01:32.136602	ok\n	2026-06-20 20:01:22.043164
\.


--
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favoritos (id, usuario_id, producto_id) FROM stdin;
1	1	3
2	3	5
\.


--
-- Data for Name: items_carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_carrito (id, carrito_id, producto_id, cantidad) FROM stdin;
\.


--
-- Data for Name: items_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_pedido (id, pedido_id, producto_id, cantidad, precio_unitario) FROM stdin;
1	1	1	5	149.99
2	1	5	1	199.99
3	2	3	18	79.99
4	3	3	1	79.99
5	4	2	1	199.99
6	5	3	10	79.99
7	6	2	5	199.99
8	7	2	1	179.99
9	8	3	2	79.99
10	8	2	1	179.99
11	9	3	1	79.99
12	9	2	1	179.99
\.


--
-- Data for Name: newsletter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newsletter (id, email, fecha_suscripcion, activo) FROM stdin;
1	matias.galvan@tecsup.edu.pe	2026-06-19 14:17:58.73833	t
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, pedido_id, monto, metodo, estado, fecha) FROM stdin;
1	1	949.94	tarjeta	aprobado	2026-06-16 13:36:58.644347
2	2	1439.82	tarjeta	aprobado	2026-06-16 13:48:56.601608
3	3	79.99	tarjeta	aprobado	2026-06-16 14:00:44.550022
4	4	199.99	tarjeta	aprobado	2026-06-19 16:50:03.661924
5	5	799.90	tarjeta	aprobado	2026-06-19 16:50:36.771504
6	6	999.95	tarjeta	aprobado	2026-06-20 00:34:28.452588
7	7	179.99	tarjeta	aprobado	2026-06-20 18:24:35.592011
8	8	339.97	tarjeta	aprobado	2026-06-20 21:20:31.105792
9	9	259.98	tarjeta	aprobado	2026-06-22 18:51:42.399968
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (id, usuario_id, total, estado, creado_en, costo_envio, subtotal) FROM stdin;
1	1	949.94	pagado	2026-06-16 13:36:58.578432	0.00	0.00
2	1	1439.82	pagado	2026-06-16 13:48:56.523681	0.00	0.00
3	1	79.99	pagado	2026-06-16 14:00:44.536115	0.00	0.00
5	1	799.90	entregado	2026-06-19 16:50:36.754293	0.00	0.00
6	2	999.95	pagado	2026-06-20 00:34:28.422035	0.00	0.00
7	2	179.99	pagado	2026-06-20 18:24:35.573073	0.00	0.00
4	1	199.99	cancelado	2026-06-19 16:50:03.588449	0.00	0.00
8	3	339.97	entregado	2026-06-20 21:20:31.087303	0.00	339.97
9	3	259.98	pagado	2026-06-22 18:51:42.374786	0.00	259.98
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, categoria_id, nombre, descripcion, precio, stock, imagen_url, activo, descuento, oferta_fin) FROM stdin;
3	1	Mouse Inalambrico	Mouse ergonomico con bateria recargable	79.99	25	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400	t	0	\N
4	2	Polo Basico	Polo de algodon premium	49.99	50	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400	t	0	\N
5	2	Zapatillas Deportivas	Zapatillas comodas para correr	199.99	30	https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400	t	0	\N
6	3	Lampara de escritorio	Lampara LED regulable con USB	89.99	30	https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400	t	0	\N
7	3	Cojin Decorativo	Cojin suave para sala o dormitorio	34.99	40	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400	t	0	\N
1	1	Audifonos Bluetooth	Audifonos inalambricos con cancelacion de ruido	149.99	20	https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400	f	0	\N
2	1	Teclado Mecanico	Teclado mecanico RGB para gaming	199.99	15	https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400	t	10	2026-06-26 05:29:00
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, usuario_id, producto_id, rating, comentario, fecha) FROM stdin;
\.


--
-- Data for Name: testimonios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonios (id, usuario_id, texto, rating, aprobado, fecha) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash, rol, activo, creado_en, telefono, direccion) FROM stdin;
1	Matias Galvan Guerrero	matias.galvan@tecsup.edu.pe	$2b$10$S6mmsRxGuvKC1ywaR5NUOeSd1dkxfA53JoJAlVCdcgBwMMGMVpixm	admin	t	2026-06-19 17:07:50.07194	\N	\N
2	Matias	matigalvanguerrero@gmail.com	$2b$10$mGwhEzBlnJuUJtonaTD95e5MQeETXsCHvTLolZWQ0WJ9S6XHzaZde	cliente	t	2026-06-19 21:09:48.773094	\N	\N
3	Mati	iammatiasdev@gmail.com	$2b$10$cHuRL0ZMeeSgDNZ6nyUC1OTagtSAVllOw2NHaJTg0FUYsMlm2qcvq	cliente	t	2026-06-20 21:19:54.02828	\N	\N
\.


--
-- Name: carritos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carritos_id_seq', 3, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 3, true);


--
-- Name: contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacto_id_seq', 1, true);


--
-- Name: favoritos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favoritos_id_seq', 2, true);


--
-- Name: items_carrito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_carrito_id_seq', 15, true);


--
-- Name: items_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_pedido_id_seq', 12, true);


--
-- Name: newsletter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.newsletter_id_seq', 1, true);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 9, true);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 9, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 7, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 1, false);


--
-- Name: testimonios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.testimonios_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);


--
-- Name: carritos carritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carritos
    ADD CONSTRAINT carritos_pkey PRIMARY KEY (id);


--
-- Name: carritos carritos_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carritos
    ADD CONSTRAINT carritos_usuario_id_key UNIQUE (usuario_id);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: contacto contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto
    ADD CONSTRAINT contacto_pkey PRIMARY KEY (id);


--
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id);


--
-- Name: favoritos favoritos_usuario_id_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_producto_id_key UNIQUE (usuario_id, producto_id);


--
-- Name: items_carrito items_carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT items_carrito_pkey PRIMARY KEY (id);


--
-- Name: items_pedido items_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_pkey PRIMARY KEY (id);


--
-- Name: newsletter newsletter_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter
    ADD CONSTRAINT newsletter_email_key UNIQUE (email);


--
-- Name: newsletter newsletter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter
    ADD CONSTRAINT newsletter_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pedido_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_key UNIQUE (pedido_id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_usuario_id_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_usuario_id_producto_id_key UNIQUE (usuario_id, producto_id);


--
-- Name: testimonios testimonios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonios
    ADD CONSTRAINT testimonios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: carritos carritos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carritos
    ADD CONSTRAINT carritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: favoritos favoritos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: favoritos favoritos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: items_carrito items_carrito_carrito_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT items_carrito_carrito_id_fkey FOREIGN KEY (carrito_id) REFERENCES public.carritos(id);


--
-- Name: items_carrito items_carrito_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT items_carrito_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: items_pedido items_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: items_pedido items_pedido_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_pedido
    ADD CONSTRAINT items_pedido_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: pagos pagos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: pedidos pedidos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: productos productos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- Name: ratings ratings_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: ratings ratings_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: testimonios testimonios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonios
    ADD CONSTRAINT testimonios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict HkjGOc3xJmbjJe8OseY3kuZC7pdC0hzh3k2gqDrdNkX0xhzAjdCd55STikjspco

