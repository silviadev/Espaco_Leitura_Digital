ALTER TABLE exemplares DROP CONSTRAINT exemplares_status_check;
ALTER TABLE exemplares ADD CONSTRAINT exemplares_status_check
    CHECK (status IN ('Disponível', 'Emprestado', 'Reservado', 'Danificado', 'Perdido', 'Baixado'));
ALTER TABLE exemplares ADD COLUMN baixa_motivo text,
    ADD COLUMN baixa_observacao varchar(2000),
    ADD COLUMN baixa_em timestamptz;
ALTER TABLE exemplares ADD CONSTRAINT exemplares_baixa_check CHECK (
    (status = 'Baixado' AND baixa_em IS NOT NULL AND baixa_motivo IS NOT NULL
        AND baixa_motivo IN ('Perda', 'Dano/rasuras', 'Doação', 'Outro')
        AND (baixa_motivo <> 'Outro' OR length(btrim(coalesce(baixa_observacao, ''))) > 0))
    OR (status <> 'Baixado' AND baixa_motivo IS NULL AND baixa_em IS NULL AND baixa_observacao IS NULL)
);
