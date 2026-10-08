CREATE TABLE leitores (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome varchar(200) NOT NULL CHECK (btrim(nome) <> ''),
    tipo varchar(30) NOT NULL CHECK (tipo IN ('Aluno', 'Professor', 'Funcionário', 'Voluntário', 'Comunidade')),
    matricula_codigo varchar(80),
    turma varchar(100),
    data_nascimento date NOT NULL CHECK (data_nascimento >= DATE '0001-01-01' AND data_nascimento <= CURRENT_DATE),
    telefone varchar(30),
    email varchar(254),
    centro_id integer NOT NULL REFERENCES centros(id) ON DELETE RESTRICT,
    status varchar(10) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    data_cadastro timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX leitores_centro_idx ON leitores(centro_id);
-- Uma matrícula identifica o leitor dentro do Centro. Vários leitores podem não ter matrícula.
CREATE UNIQUE INDEX leitores_matricula_centro_unica
    ON leitores(centro_id, lower(matricula_codigo)) WHERE matricula_codigo IS NOT NULL;
