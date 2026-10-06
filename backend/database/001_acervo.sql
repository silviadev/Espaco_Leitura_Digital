-- Livro representa a obra; exemplar representa uma cópia física.
CREATE TABLE centros (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome text NOT NULL UNIQUE CHECK (btrim(nome) <> '')
);

CREATE TABLE livros (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo text NOT NULL CHECK (btrim(titulo) <> ''),
    autor text NOT NULL CHECK (btrim(autor) <> ''),
    isbn text,
    editora text,
    ano integer CHECK (ano > 0),
    categoria text NOT NULL CHECK (btrim(categoria) <> ''),
    faixa_etaria text,
    capa_url text CHECK (capa_url IS NULL OR capa_url ~ '^https?://[^[:space:]]+$'),
    sinopse text,
    criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE exemplares (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Gera códigos únicos no banco, inclusive para cadastros simultâneos.
    codigo text GENERATED ALWAYS AS (
        'EX-' || lpad(id::text, greatest(4, length(id::text)), '0')
    ) STORED UNIQUE,
    livro_id integer NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
    centro_id integer NOT NULL REFERENCES centros(id) ON DELETE RESTRICT,
    localizacao text,
    status text NOT NULL DEFAULT 'Disponível'
        CHECK (status IN ('Disponível', 'Emprestado', 'Reservado', 'Danificado', 'Perdido')),
    criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX exemplares_livro_idx ON exemplares(livro_id);
CREATE INDEX exemplares_centro_idx ON exemplares(centro_id);

INSERT INTO centros(nome) VALUES ('CE Maranhão'), ('CE Piauí'), ('CE Bahia');
-- Obras de demonstração do frontend não são importadas automaticamente.
