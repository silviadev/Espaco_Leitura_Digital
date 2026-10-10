CREATE TABLE devolucoes (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emprestimo_id integer NOT NULL UNIQUE REFERENCES emprestimos(id) ON DELETE RESTRICT,
    condicao text NOT NULL CHECK (condicao IN ('Disponível', 'Danificado')),
    observacao varchar(2000),
    dias_atraso integer NOT NULL CHECK (dias_atraso >= 0),
    registrado_em timestamptz NOT NULL DEFAULT now(),
    CHECK (condicao <> 'Danificado' OR length(btrim(coalesce(observacao, ''))) > 0)
);
