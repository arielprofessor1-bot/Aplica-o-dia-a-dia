
/* ========================================
   1. ELEMENTOS DO HTML
======================================== */

// Formulário e campos
const formulario = document.getElementById("form-tarefa");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");
const campoTipo = document.getElementById("tipo");
const campoData = document.getElementById("data");
const campoPrioridade = document.getElementById("prioridade");

// Áreas que serão atualizadas
const listaTarefas = document.getElementById("lista-tarefas");
const dataAtual = document.getElementById("data-atual");

const totalTarefas = document.getElementById("total-tarefas");
const tarefasPendentes = document.getElementById("tarefas-pendentes");
const tarefasConcluidas = document.getElementById("tarefas-concluidas");

const porcentagem = document.getElementById("porcentagem");
const barraProgresso = document.getElementById("barra-progresso");


/* ========================================
   2. LISTA DE ATIVIDADES
======================================== */

// Por enquanto, os dados ficam na memória.
let atividades = [];


/* ========================================
   3. MOSTRAR A DATA ATUAL
======================================== */

function mostrarDataAtual() {
    const hoje = new Date();

    const dataFormatada = hoje.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    dataAtual.textContent =
        dataFormatada.charAt(0).toUpperCase() +
        dataFormatada.slice(1);
}


/* ========================================
   4. CADASTRAR UMA ATIVIDADE
======================================== */

formulario.addEventListener("submit", function(evento) {
    // Evita que a página recarregue ao enviar o formulário.
    evento.preventDefault();

    // Cria um objeto com os dados preenchidos.
    const atividade = {
        id: Date.now(),
        titulo: campoTitulo.value.trim(),
        descricao: campoDescricao.value.trim(),
        tipo: campoTipo.value,
        data: campoData.value,
        prioridade: campoPrioridade.value,
        concluida: false,
        concluidaEm: null
    };

    // Verifica se o título foi preenchido.
    if (atividade.titulo === "") {
        alert("Digite o nome da atividade.");
        campoTitulo.focus();
        return;
    }

    // Adiciona a atividade à lista.
    atividades.push(atividade);

    // Atualiza a tela.
    renderizarAtividades();
    atualizarResumo();

    // Limpa os campos do formulário.
    formulario.reset();

    // Coloca o foco no campo do título.
    campoTitulo.focus();
});


/* ========================================
   5. MOSTRAR AS ATIVIDADES NA TELA
======================================== */

function renderizarAtividades() {
    // Limpa a lista antes de desenhá-la novamente.
    listaTarefas.innerHTML = "";

    // Se não houver atividades, mostra uma mensagem.
    if (atividades.length === 0) {
        listaTarefas.innerHTML = `
            <p class="mensagem-vazia">
                Nenhuma atividade cadastrada ainda.
            </p>
        `;
        return;
    }

    // Percorre todas as atividades cadastradas.
    atividades.forEach(function(atividade) {
        // Cria um cartão para cada atividade.
        const cartao = document.createElement("article");

        cartao.classList.add("item-tarefa");

        // Destaca as atividades concluídas.
        if (atividade.concluida) {
            cartao.classList.add("concluida");
        }

        // Cria a classe correspondente à prioridade.
        const classePrioridade = {
            "Baixa": "prioridade-baixa",
            "Média": "prioridade-media",
            "Alta": "prioridade-alta"
        }[atividade.prioridade];

        // Converte a data para o formato brasileiro.
        const partesData = atividade.data.split("-");
        const dataBrasileira =
            `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

        // Insere o conteúdo do cartão.
        cartao.innerHTML = `
            <h3>${escaparHTML(atividade.titulo)}</h3>

            <p>${escaparHTML(atividade.descricao || "Sem descrição")}</p>

            <p>
                <strong>Tipo:</strong>
                ${escaparHTML(atividade.tipo)}
            </p>

            <p>
                <strong>Entrega:</strong>
                ${dataBrasileira}
            </p>

            <p>
                <strong>Prioridade:</strong>
                <span class="prioridade ${classePrioridade}">
                    ${escaparHTML(atividade.prioridade)}
                </span>
            </p>

            <p>
                <strong>Status:</strong>
                ${atividade.concluida ? "Concluída" : "Pendente"}
            </p>

            <div class="acoes-tarefa">
                <button
                    type="button"
                    data-acao="concluir"
                    data-id="${atividade.id}"
                >
                    ${atividade.concluida
                        ? "Desfazer conclusão"
                        : "Concluir"}
                </button>

                <button
                    type="button"
                    data-acao="excluir"
                    data-id="${atividade.id}"
                >
                    Excluir
                </button>
            </div>
        `;

        // Adiciona o cartão à lista.
        listaTarefas.appendChild(cartao);
    });
}


/* ========================================
   6. PROTEGER O TEXTO INSERIDO
======================================== */

// Impede que textos digitados sejam interpretados como HTML.
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, function(caractere) {
        const caracteresHTML = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteresHTML[caractere];
    });
}


/* ========================================
   7. CONCLUIR OU EXCLUIR ATIVIDADES
======================================== */

// Escuta os cliques dentro da área das atividades.
listaTarefas.addEventListener("click", function(evento) {
    const botao = evento.target.closest("button[data-acao]");

    // Se o clique não foi em um botão, não faz nada.
    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    // Localiza a atividade correspondente ao botão.
    const atividade = atividades.find(function(item) {
        return item.id === id;
    });

    if (!atividade) {
        return;
    }

    // Marca como concluída ou desfaz a conclusão.
    if (acao === "concluir") {
        atividade.concluida = !atividade.concluida;

        // Registra quando a atividade foi concluída.
        atividade.concluidaEm = atividade.concluida
            ? new Date().toLocaleDateString("en-CA")
            : null;
    }

    // Exclui a atividade selecionada.
    if (acao === "excluir") {
        const confirmacao = confirm(
            `Deseja excluir "${atividade.titulo}"?`
        );

        if (!confirmacao) {
            return;
        }

        atividades = atividades.filter(function(item) {
            return item.id !== id;
        });
    }

    // Atualiza a tela e os indicadores.
    renderizarAtividades();
    atualizarResumo();
});


/* ========================================
   8. ATUALIZAR OS INDICADORES
======================================== */

function atualizarResumo() {
    // Quantidade total de atividades.
    totalTarefas.textContent = atividades.length;

    // Quantidade de atividades pendentes.
    const pendentes = atividades.filter(function(atividade) {
        return !atividade.concluida;
    });

    tarefasPendentes.textContent = pendentes.length;

    // Quantidade de atividades concluídas hoje.
    const hoje = new Date().toLocaleDateString("en-CA");

    const concluidasHoje = atividades.filter(function(atividade) {
        return atividade.concluida &&
               atividade.concluidaEm === hoje;
    });

    tarefasConcluidas.textContent = concluidasHoje.length;

    // Calcula o progresso de hoje.
    const atividadesDeHoje = atividades.filter(function(atividade) {
        return atividade.data === hoje;
    });

    const concluidasDoDia = atividadesDeHoje.filter(function(atividade) {
        return atividade.concluida;
    });

    let progresso = 0;

    if (atividadesDeHoje.length > 0) {
        progresso = Math.round(
            (concluidasDoDia.length / atividadesDeHoje.length) * 100
        );
    }

    // Atualiza a porcentagem e a barra visual.
    porcentagem.textContent = `${progresso}%`;
    barraProgresso.style.width = `${progresso}%`;
}


/* ========================================
   9. INICIALIZAR A APLICAÇÃO
======================================== */

// Executa quando o navegador carrega o script.
mostrarDataAtual();
renderizarAtividades();
atualizarResumo();
