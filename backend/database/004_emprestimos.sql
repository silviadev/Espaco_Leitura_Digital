CREATE TABLE emprestimos (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leitor_id integer NOT NULL REFERENCES leitores(id) ON DELETE RESTRICT,
    exemplar_id integer NOT NULL REFERENCES exemplares(id) ON DELETE RESTRICT,
    data_emprestimo date NOT NULL,
    data_prevista_devolucao date NOT NULL CHECK (data_prevista_devolucao >= data_emprestimo),
    data_devolucao date CHECK (data_devolucao >= data_emprestimo),
    observacao varchar(2000),
    versao integer NOT NULL DEFAULT 0 CHECK (versao >= 0),
    criado_em timestamptz NOT NULL DEFAULT now()
);
-- Mesmo diante de requisições concorrentes, uma cópia tem apenas uma retirada aberta.
CREATE UNIQUE INDEX emprestimos_exemplar_aberto_unico ON emprestimos(exemplar_id)
    WHERE data_devolucao IS NULL;
CREATE INDEX emprestimos_leitor_abertos_idx ON emprestimos(leitor_id) WHERE data_devolucao IS NULL;
CREATE TABLE renovacoes_emprestimo (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emprestimo_id integer NOT NULL REFERENCES emprestimos(id) ON DELETE RESTRICT,
    data_anterior date NOT NULL,
    nova_data date NOT NULL CHECK (nova_data > data_anterior),
    renovado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX renovacoes_emprestimo_idx ON renovacoes_emprestimo(emprestimo_id);
