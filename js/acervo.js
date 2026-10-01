/* =========================================================
   ESPAÇO DE LEITURA DIGITAL
   Página: Acervo
========================================================= */


/* =========================================================
   DADOS INICIAIS
   Cada LIVRO possui seus EXEMPLARES físicos.
========================================================= */

const livros = [

    {
        id: 1,

        titulo: "O Pequeno Príncipe",

        autor: "Antoine de Saint-Exupéry",

        isbn: "9788595081512",

        editora: "HarperCollins",

        ano: 2018,

        categoria: "Literatura",

        faixaEtaria: "Livre",

        sinopse:
            "Uma história sobre amizade, responsabilidade e descobertas.",

        exemplares: [

            {
                id: 1,
                codigo: "EX-0001",
                centro: "CE Maranhão",
                localizacao: "Estante 1 - Prateleira A",
                status: "Disponível"
            },

            {
                id: 2,
                codigo: "EX-0002",
                centro: "CE Maranhão",
                localizacao: "Estante 1 - Prateleira A",
                status: "Emprestado"
            },

            {
                id: 3,
                codigo: "EX-0003",
                centro: "CE Piauí",
                localizacao: "Estante 2 - Prateleira B",
                status: "Disponível"
            },

            {
                id: 4,
                codigo: "EX-0004",
                centro: "CE Bahia",
                localizacao: "Estante 1 - Prateleira C",
                status: "Disponível"
            }

        ]
    },


    {
        id: 2,

        titulo: "Extraordinário",

        autor: "R. J. Palacio",

        isbn: "9788580573015",

        editora: "Intrínseca",

        ano: 2013,

        categoria: "Infantojuvenil",

        faixaEtaria: "10 a 14 anos",

        sinopse:
            "A história de Auggie e sua experiência ao frequentar a escola.",

        exemplares: [

            {
                id: 5,
                codigo: "EX-0005",
                centro: "CE Maranhão",
                localizacao: "Estante 3 - Prateleira A",
                status: "Disponível"
            },

            {
                id: 6,
                codigo: "EX-0006",
                centro: "CE Piauí",
                localizacao: "Estante 1 - Prateleira B",
                status: "Disponível"
            },

            {
                id: 7,
                codigo: "EX-0007",
                centro: "CE Bahia",
                localizacao: "Estante 2 - Prateleira A",
                status: "Emprestado"
            }

        ]
    },


    {
        id: 3,

        titulo: "Coraline",

        autor: "Neil Gaiman",

        isbn: "9788551006757",

        editora: "Intrínseca",

        ano: 2020,

        categoria: "Fantasia",

        faixaEtaria: "12 anos ou mais",

        sinopse:
            "Coraline descobre uma passagem para uma realidade aparentemente perfeita.",

        exemplares: [

            {
                id: 8,
                codigo: "EX-0008",
                centro: "CE Maranhão",
                localizacao: "Estante 4 - Prateleira A",
                status: "Emprestado"
            },

            {
                id: 9,
                codigo: "EX-0009",
                centro: "CE Piauí",
                localizacao: "Estante 4 - Prateleira B",
                status: "Emprestado"
            }

        ]
    },


    {
        id: 4,

        titulo: "O Menino Maluquinho",

        autor: "Ziraldo",

        isbn: "9788506055108",

        editora: "Melhoramentos",

        ano: 2005,

        categoria: "Infantojuvenil",

        faixaEtaria: "8 a 12 anos",

        sinopse:
            "As aventuras e descobertas de um menino alegre, criativo e cheio de imaginação.",

        exemplares: [

            {
                id: 10,
                codigo: "EX-0010",
                centro: "CE Maranhão",
                localizacao: "Estante 2 - Prateleira A",
                status: "Disponível"
            },

            {
                id: 11,
                codigo: "EX-0011",
                centro: "CE Piauí",
                localizacao: "Estante 3 - Prateleira A",
                status: "Disponível"
            },

            {
                id: 12,
                codigo: "EX-0012",
                centro: "CE Bahia",
                localizacao: "Estante 3 - Prateleira B",
                status: "Disponível"
            }

        ]
    }

];



/* =========================================================
   CONTADOR DE EXEMPLARES
========================================================= */

let proximoIdExemplar = 13;



/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const tabela =
    document.getElementById("tabelaAcervo");


const campoBusca =
    document.getElementById("campoBusca");


const filtroCategoria =
    document.getElementById("filtroCategoria");


const filtroStatus =
    document.getElementById("filtroStatus");


const filtroCentro =
    document.getElementById("filtroCentro");


const formLivro =
    document.getElementById("formLivro");



/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */


/*
    Retorna todos os exemplares disponíveis
    de determinado livro.
*/

function exemplaresDisponiveis(livro) {

    return livro.exemplares.filter(

        exemplar =>
            exemplar.status === "Disponível"

    );

}



/*
    Retorna todos os exemplares emprestados.
*/

function exemplaresEmprestados(livro) {

    return livro.exemplares.filter(

        exemplar =>
            exemplar.status === "Emprestado"

    );

}



/*
    Determina o status geral apresentado na tabela.
*/

function descobrirStatusLivro(livro) {

    const disponiveis =
        exemplaresDisponiveis(livro).length;


    const emprestados =
        exemplaresEmprestados(livro).length;


    if (disponiveis > 0) {

        return "Disponível";

    }


    if (emprestados > 0) {

        return "Emprestado";

    }


    return "Indisponível";

}



/*
    Define a cor do badge.
*/

function classeStatus(status) {

    if (status === "Disponível") {

        return "badge-green";

    }


    if (status === "Emprestado") {

        return "badge-purple";

    }


    return "badge-pink";

}



/*
    Descobre em quais Centros existem
    exemplares daquele livro.
*/

function obterCentrosLivro(livro) {

    const centros =
        livro.exemplares.map(

            exemplar =>
                exemplar.centro

        );


    /*
        Set elimina valores repetidos.
    */

    return [...new Set(centros)];

}



/*
    Texto que será mostrado na tabela.
*/

function textoCentrosLivro(livro) {

    const centros =
        obterCentrosLivro(livro);


    if (centros.length === 1) {

        return centros[0];

    }


    return `${centros.length} Centros`;

}



/*
    Verifica se o livro corresponde
    ao filtro de status escolhido.
*/

function correspondeAoStatus(
    livro,
    statusSelecionado
) {

    if (statusSelecionado === "") {

        return true;

    }


    if (statusSelecionado === "Disponível") {

        return livro.exemplares.some(

            exemplar =>
                exemplar.status === "Disponível"

        );

    }


    if (statusSelecionado === "Emprestado") {

        return livro.exemplares.some(

            exemplar =>
                exemplar.status === "Emprestado"

        );

    }


    if (statusSelecionado === "Indisponível") {

        return !livro.exemplares.some(

            exemplar =>
                exemplar.status === "Disponível"

        );

    }


    return true;

}



/* =========================================================
   RENDERIZAR TABELA
========================================================= */

function renderizarLivros(lista) {

    tabela.innerHTML = "";


    if (lista.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center py-5"
                >

                    <div class="mb-2">

                        <i
                            class="bi bi-search"
                            style="font-size: 24px;"
                        ></i>

                    </div>

                    Nenhum livro encontrado.

                </td>

            </tr>

        `;

        return;

    }



    lista.forEach(livro => {


        /*
            Agora calculamos automaticamente.
        */

        const totalExemplares =
            livro.exemplares.length;


        const disponiveis =
            exemplaresDisponiveis(livro).length;


        const status =
            descobrirStatusLivro(livro);


        const centros =
            obterCentrosLivro(livro);


        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>

                <div class="book-info">

                    <div class="book-cover">

                        <i class="bi bi-book"></i>

                    </div>


                    <div>

                        <strong>
                            ${livro.titulo}
                        </strong>

                        <span>
                            ${livro.autor}
                        </span>

                    </div>

                </div>

            </td>



            <td>

                <span class="category-badge">

                    ${livro.categoria}

                </span>

            </td>



            <td
                title="${centros.join(", ")}"
            >

                ${textoCentrosLivro(livro)}

            </td>



            <td>

                ${totalExemplares}

            </td>



            <td>

                ${disponiveis}

            </td>



            <td>

                <span
                    class="
                        badge-status
                        ${classeStatus(status)}
                    "
                >

                    ${status}

                </span>

            </td>



            <td class="text-end">

                <button
                    class="table-action"
                    title="Visualizar livro"
                    onclick="visualizarLivro(${livro.id})"
                >

                    <i class="bi bi-eye"></i>

                </button>


                <button
                    class="table-action"
                    title="Editar livro"
                    onclick="editarLivro(${livro.id})"
                >

                    <i class="bi bi-pencil"></i>

                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });


    atualizarIndicadores();

}



/* =========================================================
   INDICADORES
========================================================= */

function atualizarIndicadores() {

    const totalObras =
        livros.length;


    const totalExemplares =
        livros.reduce(

            (total, livro) =>

                total +
                livro.exemplares.length,

            0

        );


    const totalDisponiveis =
        livros.reduce(

            (total, livro) =>

                total +
                exemplaresDisponiveis(livro).length,

            0

        );


    document.getElementById(
        "totalObras"
    ).textContent =
        totalObras;


    document.getElementById(
        "totalExemplares"
    ).textContent =
        totalExemplares;


    document.getElementById(
        "totalDisponiveis"
    ).textContent =
        totalDisponiveis;

}



/* =========================================================
   FILTROS
========================================================= */

function aplicarFiltros() {

    const busca =
        campoBusca.value
            .toLowerCase()
            .trim();


    const categoria =
        filtroCategoria.value;


    const statusSelecionado =
        filtroStatus.value;


    /*
        Caso ainda não exista filtroCentro no HTML,
        o código não quebra.
    */

    const centroSelecionado =
        filtroCentro
            ? filtroCentro.value
            : "";


    const resultado =
        livros.filter(livro => {


            /*
                Busca por título, autor ou ISBN.
            */

            const correspondeBusca =

                livro.titulo
                    .toLowerCase()
                    .includes(busca)

                ||

                livro.autor
                    .toLowerCase()
                    .includes(busca)

                ||

                (
                    livro.isbn &&
                    livro.isbn
                        .toLowerCase()
                        .includes(busca)
                );



            /*
                Categoria.
            */

            const correspondeCategoria =

                categoria === ""

                ||

                livro.categoria === categoria;



            /*
                Status.
            */

            const correspondeStatus =

                correspondeAoStatus(
                    livro,
                    statusSelecionado
                );



            /*
                Centro.
            */

            const correspondeCentro =

                centroSelecionado === ""

                ||

                livro.exemplares.some(

                    exemplar =>
                        exemplar.centro ===
                        centroSelecionado

                );



            return (

                correspondeBusca

                &&

                correspondeCategoria

                &&

                correspondeStatus

                &&

                correspondeCentro

            );

        });


    renderizarLivros(resultado);

}



/* =========================================================
   EVENTOS DOS FILTROS
========================================================= */

campoBusca.addEventListener(

    "input",

    aplicarFiltros

);


filtroCategoria.addEventListener(

    "change",

    aplicarFiltros

);


filtroStatus.addEventListener(

    "change",

    aplicarFiltros

);


if (filtroCentro) {

    filtroCentro.addEventListener(

        "change",

        aplicarFiltros

    );

}



/* =========================================================
   GERAR CÓDIGO DO EXEMPLAR
========================================================= */

function gerarCodigoExemplar() {

    const codigo =
        `EX-${String(
            proximoIdExemplar
        ).padStart(4, "0")}`;


    proximoIdExemplar++;


    return codigo;

}



/* =========================================================
   CADASTRAR NOVO LIVRO
========================================================= */

formLivro.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const titulo =
            document
                .getElementById("tituloLivro")
                .value
                .trim();


        const autor =
            document
                .getElementById("autorLivro")
                .value
                .trim();


        const isbn =
            document
                .getElementById("isbnLivro")
                .value
                .trim();


        const editora =
            document
                .getElementById("editoraLivro")
                .value
                .trim();


        const categoria =
            document
                .getElementById("categoriaLivro")
                .value;


        const ano =
            document
                .getElementById("anoLivro")
                .value;


        const quantidade =
            Number(

                document
                    .getElementById(
                        "quantidadeLivro"
                    )
                    .value

            );


        const localizacao =
            document
                .getElementById(
                    "localizacaoLivro"
                )
                .value
                .trim();


        const faixaEtaria =
            document
                .getElementById(
                    "faixaLivro"
                )
                .value
                .trim();


        const sinopse =
            document
                .getElementById(
                    "sinopseLivro"
                )
                .value
                .trim();



        /*
            Centro selecionado.
        */

        const campoCentro =
            document.getElementById(
                "centroLivro"
            );


        if (!campoCentro) {

            alert(
                "O campo Centro de Educação não foi encontrado no formulário."
            );

            return;

        }


        const centro =
            campoCentro.value;



        /*
            Validação básica.
        */

        if (
            titulo === ""
            ||
            autor === ""
            ||
            categoria === ""
            ||
            centro === ""
            ||
            quantidade < 1
        ) {

            alert(
                "Preencha todos os campos obrigatórios."
            );

            return;

        }



        /*
            Criamos os exemplares individualmente.
        */

        const novosExemplares = [];


        for (
            let i = 0;
            i < quantidade;
            i++
        ) {

            const idExemplar =
                proximoIdExemplar;


            novosExemplares.push({

                id: idExemplar,

                codigo:
                    gerarCodigoExemplar(),

                centro:
                    centro,

                localizacao:
                    localizacao,

                status:
                    "Disponível"

            });

        }



        /*
            Criamos a obra.
        */

        const novoLivro = {

            id:
                Date.now(),

            titulo:
                titulo,

            autor:
                autor,

            isbn:
                isbn,

            editora:
                editora,

            ano:
                ano,

            categoria:
                categoria,

            faixaEtaria:
                faixaEtaria,

            sinopse:
                sinopse,

            exemplares:
                novosExemplares

        };



        /*
            Adiciona ao acervo.
        */

        livros.push(
            novoLivro
        );



        /*
            Atualiza a tabela.
        */

        aplicarFiltros();



        /*
            Limpa o formulário.
        */

        formLivro.reset();



        /*
            Como a quantidade padrão era 1,
            colocamos novamente depois do reset.
        */

        const quantidadeInput =
            document.getElementById(
                "quantidadeLivro"
            );


        quantidadeInput.value = 1;



        /*
            Fecha o modal Bootstrap.
        */

        const modalElement =
            document.getElementById(
                "modalLivro"
            );


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {

            modal.hide();

        }

    }

);



/* =========================================================
   VISUALIZAR LIVRO
   Temporário.
   Depois criaremos um modal próprio.
========================================================= */

function visualizarLivro(id) {

    const livro =
        livros.find(

            livro =>
                livro.id === id

        );


    if (!livro) {

        return;

    }


    let textoExemplares = "";


    livro.exemplares.forEach(

        exemplar => {

            textoExemplares += `

${exemplar.codigo}
Centro: ${exemplar.centro}
Localização: ${exemplar.localizacao || "Não informada"}
Status: ${exemplar.status}

----------------------------`;

        }

    );


    alert(

`${livro.titulo}

Autor: ${livro.autor}
Categoria: ${livro.categoria}
ISBN: ${livro.isbn || "Não informado"}

Total de exemplares: ${livro.exemplares.length}

EXEMPLARES
${textoExemplares}`

    );

}



/* =========================================================
   EDITAR LIVRO
   Será desenvolvido posteriormente.
========================================================= */

function editarLivro(id) {

    const livro =
        livros.find(

            livro =>
                livro.id === id

        );


    if (!livro) {

        return;

    }


    alert(

        `A edição de "${livro.titulo}" será implementada na próxima etapa.`

    );

}



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

renderizarLivros(
    livros
);