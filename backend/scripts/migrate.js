import { readFile } from "node:fs/promises";
import { criarBanco } from "../src/database.js";

const banco = criarBanco();
let conexao;
try {
    conexao = await banco.connect();
    await conexao.query("BEGIN");
    // Impede dois processos de aplicar a mesma migração simultaneamente.
    await conexao.query("SELECT pg_advisory_xact_lock(20261004)");
    await conexao.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
        nome text PRIMARY KEY, aplicada_em timestamptz NOT NULL DEFAULT now()
    )`);
    const nome = "001_acervo.sql";
    const aplicada = await conexao.query("SELECT nome FROM schema_migrations WHERE nome = $1", [nome]);
    if (aplicada.rowCount === 0) {
        const sql = await readFile(new URL(`../database/${nome}`, import.meta.url), "utf8");
        await conexao.query(sql);
        await conexao.query("INSERT INTO schema_migrations(nome) VALUES ($1)", [nome]);
    }
    await conexao.query("COMMIT");
    console.log(aplicada.rowCount ? "Banco já atualizado." : "Tabelas do acervo criadas com sucesso.");
} catch (erro) {
    if (conexao) await conexao.query("ROLLBACK").catch(() => {});
    console.error("Migração não aplicada. Verifique o banco e backend/.env. Código:", erro.code || "SEM_CODIGO");
    process.exitCode = 1;
} finally {
    conexao?.release();
    await banco.end();
}
