// ============================================================
// BATALHA SIDERAL: CAÇA AOS PLANETAS
// Jogo educacional de Ciências - Sistema Solar
// ============================================================

// Lista dos 6 planetas em ordem crescente de dificuldade
const PLANETAS_MISSAO = [
  {
    id: "terra",
    nome: "Terra",
    icone: "🌍",
    pista: "Rodada 1 (Fácil): É o terceiro planeta a partir do Sol e o único conhecido por ter água líquida na superfície e vida.",
    explicacaoAcerto: "Acertou! A Terra fica na zona habitável do Sistema Solar e tem cerca de 70% de sua superfície coberta por água.",
    dicaSeErrado: "Você encontrou a Terra! Ela é o 3º planeta do Sistema Solar, mas o radar agora busca outro planeta."
  },
  {
    id: "jupiter",
    nome: "Júpiter",
    icone: "🟠",
    pista: "Rodada 2 (Fácil): É o maior planeta de todo o Sistema Solar, um gigante gasoso famoso pela Grande Mancha Vermelha.",
    explicacaoAcerto: "Na mosca! Júpiter é tão grande que caberiam mais de 1.300 Terras dentro dele.",
    dicaSeErrado: "Você esbarrou em Júpiter, o gigante gasoso! Guarde esse lugar na memória para quando o radar pedir por ele."
  },
  {
    id: "saturno",
    nome: "Saturno",
    icone: "🪐",
    pista: "Rodada 3 (Média): É um gigante gasoso muito conhecido pelo seu sistema brilhante de anéis feitos de gelo e rocha.",
    explicacaoAcerto: "Excelente! Saturno é o sexto planeta a partir do Sol e tem os anéis mais visíveis e extensos.",
    dicaSeErrado: "Aqui está Saturno, o planeta dos grandes anéis! Ainda não é o alvo desta rodada."
  },
  {
    id: "marte",
    nome: "Marte",
    icone: "🔴",
    pista: "Rodada 4 (Média): Chamado de Planeta Vermelho por causa do óxido de ferro (ferrugem) em seu solo rochoso.",
    explicacaoAcerto: "Muito bem! Marte é o quarto planeta a partir do Sol e abriga o Monte Olimpo, o maior vulcão do Sistema Solar.",
    dicaSeErrado: "Você achou Marte, o Planeta Vermelho! Anote essa coordenada para a rodada certa."
  },
  {
    id: "mercurio",
    nome: "Mercúrio",
    icone: "🌑",
    pista: "Rodada 5 (Difícil): É o planeta mais próximo do Sol e o menor do Sistema Solar, sem atmosfera densa para reter calor.",
    explicacaoAcerto: "Incrível! Por quase não ter atmosfera, Mercúrio tem dias escaldantes e noites congelantes.",
    dicaSeErrado: "Este é Mercúrio, o vizinho mais próximo do Sol! Guarde essa posição."
  },
  {
    id: "venus",
    nome: "Vênus",
    icone: "🌕",
    pista: "Rodada 6 (Difícil): É o planeta mais quente do Sistema Solar por causa do efeito estufa intenso e gira no sentido oposto ao da Terra.",
    explicacaoAcerto: "Missão cumprida! Mesmo sendo o 2º planeta a partir do Sol, Vênus é mais quente que Mercúrio devido à sua atmosfera densa de gás carbônico.",
    dicaSeErrado: "Você localizou Vênus, o planeta mais quente do Sistema Solar!"
  }
];

// Configurações do tabuleiro
const TAMANHO_GRADE = 5; // Grade 5x5 = 25 setores espaciais
const SONDAS_INICIAIS = 14;
const PONTOS_POR_ACERTO = 100;

// Variáveis de estado da partida
let rodadaAtual = 0;
let sondasRestantes = SONDAS_INICIAIS;
let pontuacao = 0;
let jogoEncerrado = false;
let tempoInicio = Date.now();
let posicoesPlanetas = {}; // Guarda { indiceCelula: objetoPlaneta }
let planetasEncontrados = new Set();

// Elementos da tela
const gradeEspacialEl = document.getElementById("grade-espacial");
const textoRodadaEl = document.getElementById("texto-rodada");
const textoSondasEl = document.getElementById("texto-sondas");
const textoPontosEl = document.getElementById("texto-pontos");
const textoPistaEl = document.getElementById("texto-pista");
const caixaExplicacaoEl = document.getElementById("caixa-explicacao");
const painelFinalEl = document.getElementById("painel-final");
const tituloFinalEl = document.getElementById("titulo-final");
const mensagemFinalEl = document.getElementById("mensagem-final");
const pontosFinaisEl = document.getElementById("pontos-finais");
const tempoFinalEl = document.getElementById("tempo-final");
const botaoReiniciarEl = document.getElementById("botao-reiniciar");
const botaoTemaEl = document.getElementById("botao-tema");
const botaoTelaCheiaEl = document.getElementById("botao-tela-cheia");

// ============================================================
// INICIALIZAÇÃO E LÓGICA DO JOGO
// ============================================================

function iniciarJogo() {
  rodadaAtual = 0;
  sondasRestantes = SONDAS_INICIAIS;
  pontuacao = 0;
  jogoEncerrado = false;
  tempoInicio = Date.now();
  posicoesPlanetas = {};
  planetasEncontrados.clear();

  painelFinalEl.classList.add("oculto");
  caixaExplicacaoEl.classList.add("oculto");

  sortearPosicoesPlanetas();
  desenharTabuleiro();
  atualizarPainel();
  mostrarPistaAtual();
  notificarAlturaPortal();
}

// Espalha os 6 planetas em quadrados aleatórios diferentes do mapa
function sortearPosicoesPlanetas() {
  const indicesDisponiveis = [];
  for (let i = 0; i < TAMANHO_GRADE * TAMANHO_GRADE; i++) {
    indicesDisponiveis.push(i);
  }

  // Embaralha os números de 0 a 24
  for (let i = indicesDisponiveis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = indicesDisponiveis[i];
    indicesDisponiveis[i] = indicesDisponiveis[j];
    indicesDisponiveis[j] = temp;
  }

  // Associa cada planeta a uma posição única
  PLANETAS_MISSAO.forEach((planeta, indice) => {
    const posicaoSorteada = indicesDisponiveis[indice];
    posicoesPlanetas[posicaoSorteada] = planeta;
  });
}

// Cria os 25 botões do tabuleiro com coordenadas (A1 até E5)
function desenharTabuleiro() {
  gradeEspacialEl.innerHTML = "";
  const letrasLinhas = ["A", "B", "C", "D", "E"];

  for (let linha = 0; linha < TAMANHO_GRADE; linha++) {
    for (let coluna = 0; coluna < TAMANHO_GRADE; coluna++) {
      const indice = linha * TAMANHO_GRADE + coluna;
      const coordenada = letrasLinhas[linha] + (coluna + 1);

      const botaoCelula = document.createElement("button");
      botaoCelula.type = "button";
      botaoCelula.className = "celula-espacial";
      botaoCelula.dataset.indice = indice;
      botaoCelula.dataset.coordenada = coordenada;
      botaoCelula.textContent = coordenada;
      botaoCelula.setAttribute("aria-label", "Setor espacial " + coordenada);

      botaoCelula.addEventListener("click", () => verificarDisparo(indice, botaoCelula));
      gradeEspacialEl.appendChild(botaoCelula);
    }
  }
}

function atualizarPainel() {
  const numeroExibido = Math.min(rodadaAtual + 1, PLANETAS_MISSAO.length);
  textoRodadaEl.textContent = numeroExibido + " / " + PLANETAS_MISSAO.length;
  textoSondasEl.textContent = sondasRestantes;
  textoPontosEl.textContent = pontuacao;
}

function mostrarPistaAtual() {
  if (rodadaAtual < PLANETAS_MISSAO.length) {
    textoPistaEl.textContent = PLANETAS_MISSAO[rodadaAtual].pista;
  }
}

function mostrarExplicacao(texto, tipo) {
  caixaExplicacaoEl.textContent = texto;
  caixaExplicacaoEl.className = "caixa-explicacao " + tipo;
  notificarAlturaPortal();
}

// Calcula a distância entre o clique e o planeta alvo atual
function calcularDistancia(indiceClique, indiceAlvo) {
  const linhaClique = Math.floor(indiceClique / TAMANHO_GRADE);
  const colunaClique = indiceClique % TAMANHO_GRADE;
  const linhaAlvo = Math.floor(indiceAlvo / TAMANHO_GRADE);
  const colunaAlvo = indiceAlvo % TAMANHO_GRADE;

  return Math.max(
    Math.abs(linhaClique - linhaAlvo),
    Math.abs(colunaClique - colunaAlvo)
  );
}

// Descobre em qual quadrado está o planeta da rodada atual
function obterIndicePlanetaAlvo() {
  const planetaAlvo = PLANETAS_MISSAO[rodadaAtual];
  for (const [indice, planeta] of Object.entries(posicoesPlanetas)) {
    if (planeta.id === planetaAlvo.id) {
      return Number(indice);
    }
  }
  return -1;
}

// Trata o clique do jogador em um quadrado do mapa
function verificarDisparo(indiceClique, botaoCelula) {
  if (jogoEncerrado) return;

  const planetaAlvo = PLANETAS_MISSAO[rodadaAtual];
  const planetaNoLocal = posicoesPlanetas[indiceClique];

  // Caso 1: Acertou exatamente o planeta pedido pelo radar!
  if (planetaNoLocal && planetaNoLocal.id === planetaAlvo.id) {
    planetasEncontrados.add(planetaAlvo.id);
    pontuacao += PONTOS_POR_ACERTO;

    botaoCelula.className = "celula-espacial planeta-achado";
    botaoCelula.disabled = true;
    botaoCelula.innerHTML =
      '<span class="icone-planeta">' + planetaAlvo.icone + '</span>' +
      '<span class="nome-mini">' + planetaAlvo.nome + '</span>';

    mostrarExplicacao(planetaAlvo.explicacaoAcerto, "acerto");
    rodadaAtual++;

    // Verifica se todos os 6 planetas foram encontrados
    if (rodadaAtual >= PLANETAS_MISSAO.length) {
      pontuacao += sondasRestantes * 10; // Bônus pelas sondas economizadas
      atualizarPainel();
      finalizarJogo(true);
      return;
    }

    atualizarPainel();
    mostrarPistaAtual();
    limparCelasTemporarias();
    return;
  }

  // Caso 2: Errou o alvo — gasta 1 sonda
  sondasRestantes--;
  atualizarPainel();

  if (planetaNoLocal) {
    // Clicou em outro planeta que ainda não é o da rodada
    botaoCelula.className = "celula-espacial outro-planeta";
    botaoCelula.innerHTML =
      '<span class="icone-planeta">' + planetaNoLocal.icone + '</span>' +
      '<span class="nome-mini">' + planetaNoLocal.nome + '</span>';
    mostrarExplicacao(planetaNoLocal.dicaSeErrado, "erro");
  } else {
    // Clicou no espaço vazio: o radar avisa se está perto ou longe do alvo
    const indiceAlvo = obterIndicePlanetaAlvo();
    const distancia = calcularDistancia(indiceClique, indiceAlvo);

    if (distancia === 1) {
      botaoCelula.className = "celula-espacial vazio-perto";
      botaoCelula.textContent = "PERTO!";
      mostrarExplicacao(
        "Espaço vazio no setor " + botaoCelula.dataset.coordenada +
        ", mas o radar apitou forte! O planeta " + planetaAlvo.nome + " está a apenas 1 casa de distância.",
        "aviso"
      );
    } else {
      botaoCelula.className = "celula-espacial vazio-longe";
      botaoCelula.textContent = "VAZIO";
      mostrarExplicacao(
        "Apenas vácuo espacial no setor " + botaoCelula.dataset.coordenada +
        ". O planeta " + planetaAlvo.nome + " está a " + distancia + " casas de distância.",
        "erro"
      );
    }
  }

  // Verifica derrota se acabaram as sondas
  if (sondasRestantes <= 0) {
    finalizarJogo(false);
  }
}

// Restaura quadrados vazios ou de outros planetas não encontrados quando muda a rodada
function limparCelasTemporarias() {
  const todasCelulas = gradeEspacialEl.querySelectorAll(".celula-espacial");
  todasCelulas.forEach((celula) => {
    const idx = Number(celula.dataset.indice);
    const planeta = posicoesPlanetas[idx];

    if (!planeta || !planetasEncontrados.has(planeta.id)) {
      celula.className = "celula-espacial";
      celula.disabled = false;
      celula.textContent = celula.dataset.coordenada;
    }
  });
}

function finalizarJogo(venceu) {
  jogoEncerrado = true;
  const tempoTotalMs = Date.now() - tempoInicio;
  const segundos = Math.max(1, Math.round(tempoTotalMs / 1000));
  const pontuacaoMaxima = PLANETAS_MISSAO.length * PONTOS_POR_ACERTO + SONDAS_INICIAIS * 10;

  if (venceu) {
    tituloFinalEl.textContent = "Vitória Cósmica!";
    mensagemFinalEl.textContent =
      "Parabéns! Você localizou todos os 6 planetas usando seus conhecimentos de Ciências.";
  } else {
    tituloFinalEl.textContent = "Sondas Esgotadas!";
    mensagemFinalEl.textContent =
      "Suas sondas acabaram antes de encontrar todos os planetas. Leia as pistas com atenção e tente de novo!";
  }

  pontosFinaisEl.textContent = pontuacao;
  tempoFinalEl.textContent = segundos + "s";
  painelFinalEl.classList.remove("oculto");

  // Envia resultado para o portal da escola
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: pontuacao,
      maxScore: pontuacaoMaxima,
      timeMs: tempoTotalMs,
      detail: { jogo: "batalha-sideral-planetas" }
    },
    "*"
  );

  notificarAlturaPortal();
}

// ============================================================
// CONTROLES DE TEMA, TELA CHEIA E CONTRATO DO PORTAL
// ============================================================

function aplicarTema(tema) {
  if (tema === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    botaoTemaEl.textContent = "Escuro";
  } else {
    document.documentElement.removeAttribute("data-theme");
    botaoTemaEl.textContent = "Claro";
  }
}

botaoTemaEl.addEventListener("click", () => {
  const temaAtual = document.documentElement.getAttribute("data-theme");
  aplicarTema(temaAtual === "light" ? "dark" : "light");
});

botaoTelaCheiaEl.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

botaoReiniciarEl.addEventListener("click", iniciarJogo);

function notificarAlturaPortal() {
  const altura = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "vrgame:resize", height: altura }, "*");
}

// Escuta mensagens enviadas pelo portal
window.addEventListener("message", (evento) => {
  const dados = evento.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme" && dados.theme) {
    aplicarTema(dados.theme);
  }

  if (dados.type === "vrgame:fullscreen") {
    if (dados.fullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!dados.fullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }
});

window.addEventListener("resize", notificarAlturaPortal);

// Inicia o jogo ao carregar a página e avisa o portal
window.addEventListener("DOMContentLoaded", () => {
  iniciarJogo();
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
});