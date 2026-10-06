import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import pg from "pg";
import { criarApp } from "../src/app.js";

test("acervo persiste obras e cópias atomicamente no PostgreSQL", {
    skip: process.env.RUN_POSTGRES_TESTS !== "1"
}, async () => {
    // Apenas este schema aleatório é criado e removido; public não é alterado.
    const schema = `teste_acervo_${randomUUID().replaceAll("-", "")}`;
    const config = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {};
    const admin = new pg.Pool(config);
    let banco, servidor;
    try {
        await admin.query(`CREATE SCHEMA "${schema}"`);
        banco = new pg.Pool({ ...config, options: `-c search_path=${schema}` });
        await banco.query(await readFile(new URL("../database/001_acervo.sql", import.meta.url), "utf8"));
        servidor = criarApp(banco, () => {}).listen(0, "127.0.0.1");
        await once(servidor, "listening");
        const base = `http://127.0.0.1:${servidor.address().port}`;
        async function enviar(caminho, metodo = "GET", dados) {
            const r = await fetch(base + caminho, { method: metodo,
                headers: { "Content-Type": "application/json" }, body: dados ? JSON.stringify(dados) : undefined });
            return { status: r.status, body: await r.json() };
        }
        const obra = { titulo: "Obra de teste", autor: "Autora", categoria: "Literatura", faixaEtaria: "Livre", quantidade: 2, centroId: 1 };
        const criada = await enviar("/api/livros", "POST", obra);
        assert.equal(criada.status, 201);
        assert.equal(criada.body.exemplares.length, 2);
        const id = criada.body.id;
        await banco.query("UPDATE exemplares SET status='Emprestado' WHERE id=$1", [criada.body.exemplares[0].id]);
        const antes = (await enviar(`/api/livros/${id}`)).body;
        const editada = await enviar(`/api/livros/${id}`, "PUT", { ...obra, titulo: "Título editado", exemplares: [], id: 999 });
        assert.equal(editada.status, 200);
        assert.equal(editada.body.id, id);
        assert.deepEqual(editada.body.exemplares, antes.exemplares);
        assert.equal((await enviar(`/api/livros/${id}`)).body.titulo, "Título editado");
        const adicionada = await enviar(`/api/livros/${id}/exemplares`, "POST", { quantidade: 2, centroId: 2, localizacao: "Estante B" });
        assert.equal(adicionada.status, 201);
        assert.equal(adicionada.body.exemplares.length, 4);
        assert.equal(new Set(adicionada.body.exemplares.map(e => e.codigo)).size, 4);
        assert.equal(adicionada.body.exemplares.filter(e => e.status === "Emprestado").length, 1);
        const concorrentes = await Promise.all([1, 2].map(() => enviar(`/api/livros/${id}/exemplares`, "POST", { quantidade: 1, centroId: 3 })));
        assert.ok(concorrentes.every(r => r.status === 201));
        const final = (await enviar(`/api/livros/${id}`)).body;
        assert.equal(final.exemplares.length, 6);
        assert.equal(new Set(final.exemplares.map(e => e.codigo)).size, 6);

        // Centro inexistente falha depois do INSERT da obra: a transação deve desfazê-lo.
        assert.equal((await enviar("/api/livros", "POST", { ...obra, centroId: 99999 })).status, 400);
        assert.equal((await enviar("/api/livros")).body.length, 1);
        for (const quantidade of [0, -1, 1.5, 1001, "2"]) {
            assert.equal((await enviar(`/api/livros/${id}/exemplares`, "POST", { quantidade, centroId: 1 })).status, 400);
        }
        for (const dados of [{ titulo: " " }, { ano: "abc" }, { capaUrl: "javascript:alert(1)" }]) {
            assert.equal((await enviar("/api/livros", "POST", { ...obra, ...dados })).status, 400);
        }
        assert.equal((await enviar("/api/livros/99999", "PUT", obra)).status, 404);
        assert.equal((await enviar("/api/livros/99999/exemplares", "POST", { quantidade: 1, centroId: 1 })).status, 404);
        assert.equal((await enviar("/backend/.env")).status, 404);
        assert.equal((await enviar("/.env")).status, 404);
        const negada = await fetch(base + "/api/livros", { method: "POST", headers: { Origin: "https://outro-site.example", "Content-Type": "application/json" }, body: JSON.stringify(obra) });
        assert.equal(negada.status, 403);
        assert.equal((await fetch(base + "/api/livros", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
    } finally {
        if (servidor) await new Promise(resolve => { servidor.close(resolve); servidor.closeAllConnections(); });
        if (banco) await banco.end();
        if (/^teste_acervo_[a-f0-9]{32}$/.test(schema)) await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await admin.end();
    }
});
