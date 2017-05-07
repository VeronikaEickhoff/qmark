--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgraphql_watch; Type: SCHEMA; Schema: -; Owner: anselm
--

CREATE SCHEMA postgraphql_watch;


ALTER SCHEMA postgraphql_watch OWNER TO anselm;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = postgraphql_watch, pg_catalog;

--
-- Name: notify_watchers(); Type: FUNCTION; Schema: postgraphql_watch; Owner: anselm
--

CREATE FUNCTION notify_watchers() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$ begin perform pg_notify( 'postgraphql_watch', (select array_to_json(array_agg(x)) from (select schema_name as schema, command_tag as command from pg_event_trigger_ddl_commands()) as x)::text ); end; $$;


ALTER FUNCTION postgraphql_watch.notify_watchers() OWNER TO anselm;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: article; Type: TABLE; Schema: public; Owner: anselm
--

CREATE TABLE article (
    id integer NOT NULL,
    title text,
    body text,
    author_id integer
);


ALTER TABLE article OWNER TO anselm;

--
-- Name: article_average_rating(article); Type: FUNCTION; Schema: public; Owner: anselm
--

CREATE FUNCTION article_average_rating(article article) RETURNS double precision
    LANGUAGE sql STABLE
    AS $$
  select avg(rating) from rating where article_id = article.id
$$;


ALTER FUNCTION public.article_average_rating(article article) OWNER TO anselm;

--
-- Name: question; Type: TABLE; Schema: public; Owner: anselm
--

CREATE TABLE question (
    id integer NOT NULL,
    author_id integer,
    response_id integer,
    urgency integer,
    title text
);


ALTER TABLE question OWNER TO anselm;

--
-- Name: question_total_bounty(question); Type: FUNCTION; Schema: public; Owner: anselm
--

CREATE FUNCTION question_total_bounty(question question) RETURNS double precision
    LANGUAGE sql STABLE
    AS $$
  select sum(amount) from bounty where question_id = question.id
$$;


ALTER FUNCTION public.question_total_bounty(question question) OWNER TO anselm;

--
-- Name: trigger_questions_changed(); Type: FUNCTION; Schema: public; Owner: anselm
--

CREATE FUNCTION trigger_questions_changed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify('questions_changed', (SELECT json_object_agg("id", "title")::varchar FROM question));
  RETURN NEW;
END
$$;


ALTER FUNCTION public.trigger_questions_changed() OWNER TO anselm;

--
-- Name: user; Type: TABLE; Schema: public; Owner: anselm
--

CREATE TABLE "user" (
    id integer NOT NULL,
    username text,
    is_journalist boolean DEFAULT false
);


ALTER TABLE "user" OWNER TO anselm;

--
-- Name: user_average_rating("user"); Type: FUNCTION; Schema: public; Owner: anselm
--

CREATE FUNCTION user_average_rating("user" "user") RETURNS double precision
    LANGUAGE sql STABLE
    AS $$
  select avg(rating) from rating inner join article on rating.article_id = article.id where author_id = "user".id
$$;


ALTER FUNCTION public.user_average_rating("user" "user") OWNER TO anselm;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: anselm
--

CREATE SEQUENCE articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE articles_id_seq OWNER TO anselm;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anselm
--

ALTER SEQUENCE articles_id_seq OWNED BY article.id;


--
-- Name: bounty; Type: TABLE; Schema: public; Owner: anselm
--

CREATE TABLE bounty (
    id integer NOT NULL,
    question_id integer,
    giver_id integer,
    amount double precision
);


ALTER TABLE bounty OWNER TO anselm;

--
-- Name: bounties_id_seq; Type: SEQUENCE; Schema: public; Owner: anselm
--

CREATE SEQUENCE bounties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bounties_id_seq OWNER TO anselm;

--
-- Name: bounties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anselm
--

ALTER SEQUENCE bounties_id_seq OWNED BY bounty.id;


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: anselm
--

CREATE SEQUENCE questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_id_seq OWNER TO anselm;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anselm
--

ALTER SEQUENCE questions_id_seq OWNED BY question.id;


--
-- Name: rating; Type: TABLE; Schema: public; Owner: anselm
--

CREATE TABLE rating (
    id integer NOT NULL,
    article_id integer,
    rater_id integer,
    rating double precision
);


ALTER TABLE rating OWNER TO anselm;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: anselm
--

CREATE SEQUENCE ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ratings_id_seq OWNER TO anselm;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anselm
--

ALTER SEQUENCE ratings_id_seq OWNED BY rating.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: anselm
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO anselm;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anselm
--

ALTER SEQUENCE users_id_seq OWNED BY "user".id;


--
-- Name: article id; Type: DEFAULT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY article ALTER COLUMN id SET DEFAULT nextval('articles_id_seq'::regclass);


--
-- Name: bounty id; Type: DEFAULT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY bounty ALTER COLUMN id SET DEFAULT nextval('bounties_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY question ALTER COLUMN id SET DEFAULT nextval('questions_id_seq'::regclass);


--
-- Name: rating id; Type: DEFAULT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY rating ALTER COLUMN id SET DEFAULT nextval('ratings_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY "user" ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: article articles_pkey; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY article
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: bounty bounties_pkey; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY bounty
    ADD CONSTRAINT bounties_pkey PRIMARY KEY (id);


--
-- Name: question questions_pkey; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY question
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: rating ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: user users_pkey; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user users_username_key; Type: CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: question questions_changed; Type: TRIGGER; Schema: public; Owner: anselm
--

CREATE TRIGGER questions_changed AFTER INSERT OR DELETE OR UPDATE ON question FOR EACH STATEMENT EXECUTE PROCEDURE trigger_questions_changed();


--
-- Name: article article_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY article
    ADD CONSTRAINT article_author_id_fkey FOREIGN KEY (author_id) REFERENCES "user"(id);


--
-- Name: bounty bounty_giver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY bounty
    ADD CONSTRAINT bounty_giver_id_fkey FOREIGN KEY (giver_id) REFERENCES "user"(id);


--
-- Name: bounty bounty_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY bounty
    ADD CONSTRAINT bounty_question_id_fkey FOREIGN KEY (question_id) REFERENCES question(id);


--
-- Name: question questions_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY question
    ADD CONSTRAINT questions_author_fkey FOREIGN KEY (author_id) REFERENCES "user"(id);


--
-- Name: question questions_response_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY question
    ADD CONSTRAINT questions_response_fkey FOREIGN KEY (response_id) REFERENCES article(id);


--
-- Name: rating rating_rater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT rating_rater_id_fkey FOREIGN KEY (rater_id) REFERENCES "user"(id);


--
-- Name: rating ratings_article_fkey; Type: FK CONSTRAINT; Schema: public; Owner: anselm
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT ratings_article_fkey FOREIGN KEY (article_id) REFERENCES article(id);


--
-- Name: postgraphql_watch; Type: EVENT TRIGGER; Schema: -; Owner: anselm
--

CREATE EVENT TRIGGER postgraphql_watch ON ddl_command_end
         WHEN TAG IN ('ALTER DOMAIN', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE DOMAIN', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP DOMAIN', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP SCHEMA', 'DROP TABLE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphql_watch.notify_watchers();


--
-- PostgreSQL database dump complete
--

