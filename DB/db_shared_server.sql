--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: lince
--

CREATE TABLE categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    create_date date not null default CURRENT_DATE,
    delete_date date
);


ALTER TABLE categories OWNER TO lince;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: lince
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE categories_id_seq OWNER TO lince;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lince
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- Name: config; Type: TABLE; Schema: public; Owner: lince
--

CREATE TABLE config (
    name character varying(55) NOT NULL,
    value character varying(255)
);


ALTER TABLE config OWNER TO lince;

--
-- Name: job_positions; Type: TABLE; Schema: public; Owner: lince
--

CREATE TABLE job_positions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    id_category integer NOT NULL,
    create_date date not null default CURRENT_DATE,
    delete_date date
);


ALTER TABLE job_positions OWNER TO lince;

--
-- Name: job_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: lince
--

CREATE SEQUENCE job_positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE job_positions_id_seq OWNER TO lince;

--
-- Name: job_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lince
--

ALTER SEQUENCE job_positions_id_seq OWNED BY job_positions.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: lince
--

CREATE TABLE skills (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    id_category integer NOT NULL,
    create_date date not null default CURRENT_DATE,
    delete_date date
);


ALTER TABLE skills OWNER TO lince;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: lince
--

CREATE SEQUENCE skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE skills_id_seq OWNER TO lince;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lince
--

ALTER SEQUENCE skills_id_seq OWNED BY skills.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: lince
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: lince
--

ALTER TABLE ONLY job_positions ALTER COLUMN id SET DEFAULT nextval('job_positions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: lince
--

ALTER TABLE ONLY skills ALTER COLUMN id SET DEFAULT nextval('skills_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: lince
--

COPY categories (id, name, description, create_date, delete_date) FROM stdin;
1	software	Categoría relacionada con software	2016-08-31	\N
2	music	Categoría relacionada con la música	2016-08-31	\N
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lince
--

SELECT pg_catalog.setval('categories_id_seq', 2, true);


--
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: lince
--

COPY config (name, value) FROM stdin;
version	0.0.1
\.


--
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: lince
--

COPY job_positions (id, name, description, id_category, create_date, delete_date) FROM stdin;
1	developer	Desarrollador	1	2016-08-31	\N
2	project manager	Persona encargada de manejar el proyecto	1	2016-08-31	\N
3	dj	Persona que selecciona y mezcla música	2	2016-08-31	\N
\.


--
-- Name: job_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lince
--

SELECT pg_catalog.setval('job_positions_id_seq', 3, true);


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: lince
--

COPY skills (id, name, description, id_category, create_date, delete_date) FROM stdin;
1	c	Lenguaje de programación C	1	2016-08-31	\N
2	Java	Lenguaje de programación Java	1	2016-08-31	\N
\.


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lince
--

SELECT pg_catalog.setval('skills_id_seq', 2, true);


--
-- Name: categories_pkey; Type: CONSTRAINT; Schema: public; Owner: lince
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: config_pkey; Type: CONSTRAINT; Schema: public; Owner: lince
--

ALTER TABLE ONLY config
    ADD CONSTRAINT config_pkey PRIMARY KEY (name);


--
-- Name: job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: lince
--

ALTER TABLE ONLY job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- Name: skills_pkey; Type: CONSTRAINT; Schema: public; Owner: lince
--

ALTER TABLE ONLY skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

