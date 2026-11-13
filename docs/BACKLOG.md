# FORJA Match — Backlog para issues

Mapeamento do que precisa ser feito no projeto, organizado em épicos. Cada item já está no formato de issue (título, labels, prioridade, contexto e critérios de aceite) para ser copiado para o GitHub.

## Convenções sugeridas

**Prioridade**

| Label | Significado |
| --- | --- |
| `P0` | Bloqueia o uso confiável no totem. Fazer antes do próximo evento. |
| `P1` | Impacto direto na experiência, nos dados ou na divulgação dos jogos. |
| `P2` | Melhoria de robustez, desempenho ou manutenção. |
| `P3` | Limpeza e organização. Fazer quando houver folga. |

**Tipo:** `bug`, `enhancement`, `docs`, `chore`, `research`
**Área:** `area:kiosk-offline`, `area:telemetria`, `area:match`, `area:conteudo`, `area:codigo`

## Visão geral

| # | Título | Prioridade | Épico |
| --- | --- | --- | --- |
| A1 | Voltar à tela inicial após inatividade | P0 | Totem e offline |
| A2 | App não abre offline (shell fora do cache) | P0 | Totem e offline |
| A3 | Iluminação do cartucho 3D depende de CDN externo | P0 | Totem e offline |
| A4 | Toques acidentais no link da Netlify tiram o visitante do app | P1 | Totem e offline |
| A5 | Manifest PWA para instalar no Android em tela cheia | P1 | Totem e offline |
| A6 | Totens sem ID configurado são registrados como `totem_01` | P1 | Totem e offline |
| A7 | Sincronização com Firestore pouco resiliente em rede instável | P2 | Totem e offline |
| A8 | Service worker nunca atualiza assets já em cache | P2 | Totem e offline |
| A9 | localStorage cresce sem limite | P2 | Totem e offline |
| B1 | Registrar sessões abandonadas (taxa de conclusão) | P1 | Telemetria |
| B2 | Versionar regras de segurança do Firestore | P1 | Telemetria |
| B3 | Registrar versão do app e do questionário em cada sessão | P1 | Telemetria |
| C1 | Definir nova metodologia de perfil (HEXAD-12) | P1 | Metodologia de match |
| C2 | Normalizar a pontuação para não favorecer jogos com mais tags | P1 | Metodologia de match |
| C3 | Critério de desempate explícito | P1 | Metodologia de match |
| C4 | Script e teste de balanceamento dos resultados | P1 | Metodologia de match |
| C5 | Reescrever cards e tags dos jogos na nova metodologia | P1 | Metodologia de match |
| D1 | Guia "Como adicionar um novo jogo" | P1 | Conteúdo e docs |
| D2 | Otimizar imagens dos jogos | P2 | Conteúdo e docs |
| D3 | Caminho da imagem de You're Gonna Be Late sem `/` | P2 | Conteúdo e docs |
| D4 | Atualizar README | P3 | Conteúdo e docs |
| E1 | Lista de assets duplicada entre `sw.js` e `assetCache.js` | P2 | Código |
| E2 | Carregar o three.js sob demanda (bundle de 1,6 MB) | P2 | Código |
| E3 | Remover assets não utilizados e corrigir nome do `FORJAHub.glb` | P3 | Código |
| E4 | `standLocation` definido mas não exibido | P3 | Código |
| E5 | Código morto e duplicado em componentes | P3 | Código |
| F1 | Carregar jogos e cards de fonte externa por evento | Futuro | Futuro |

---

## Épico A — Operação em totem e offline

### A1 · Voltar à tela inicial após inatividade
**Labels:** `enhancement`, `area:kiosk-offline`, `P0`

**Contexto:** se um visitante abandona a partida no meio ou na tela de resultado, o totem fica parado ali e a próxima pessoa começa de onde a outra parou. Isso contamina as respostas e prejudica a atração de novos visitantes.

**Critérios de aceite**
- [ ] Na tela de jogo, após N segundos sem interação, o app volta para a tela inicial (sugestão: 45 s).
- [ ] Na tela de resultado, volta após M segundos (sugestão: 60 s), com tempo suficiente para escanear o QR code.
- [ ] Opcional: aviso "Ainda está aí?" com contagem regressiva antes de reiniciar.
- [ ] Tempos configuráveis em um único lugar.
- [ ] A sessão interrompida é registrada como abandonada (ver B1).

### A2 · App não abre offline (shell fora do cache)
**Labels:** `bug`, `area:kiosk-offline`, `P0`

**Contexto:** o `public/sw.js` guarda em cache apenas o modelo 3D, o logo e as imagens dos jogos. `index.html` e os bundles JS/CSS gerados pelo Vite (com hash no nome) não são guardados. Se o totem recarregar a página sem internet, o app não abre.

**Critérios de aceite**
- [ ] `index.html`, JS e CSS do build ficam em cache (precache com o manifesto do build, por exemplo via `vite-plugin-pwa`/Workbox ou gerando a lista no build).
- [ ] Teste: abrir uma vez online, desligar a rede, recarregar → o app funciona do início ao resultado.
- [ ] Navegações (`?kiosk=`, `?admin=1`) também funcionam offline.

### A3 · Iluminação do cartucho 3D depende de CDN externo
**Labels:** `bug`, `area:kiosk-offline`, `P0`

**Contexto:** `<Environment preset="city">` em `CartuchoFORJA.jsx` baixa `potsdamer_platz_1k.hdr` de `raw.githack.com`. Offline ou com rede ruim, o modelo não termina de carregar ou fica sem iluminação. O service worker só guarda arquivos da mesma origem.

**Critérios de aceite**
- [ ] O HDR fica hospedado no próprio projeto (`public/`) e é carregado pela prop `files` do `Environment`, ou o `Environment` é substituído por luzes locais.
- [ ] O arquivo entra no precache do service worker.
- [ ] O cartucho renderiza corretamente com a rede desligada.

### A4 · Toques acidentais no link da Netlify tiram o visitante do app
**Labels:** `bug`, `area:kiosk-offline`, `P1`

**Contexto:** o rodapé "This site is powered by Netlify" na `StartScreen` é um link com `target="_blank"`. **Ele precisa continuar existindo e funcionando:** é uma exigência do plano open source da Netlify, que dá acesso aos benefícios de build. O problema é que ele fica logo abaixo do botão "Começar", e alguns visitantes tocam nele sem querer, abrindo outra aba e saindo da experiência.

**Opções (podem ser combinadas)**
1. **Afastar o link do botão:** mover o crédito para a borda inferior da tela, longe do "Começar", com fonte pequena e sem padding extra de toque. Resolve a maioria dos toques acidentais sem mudar o link.
2. **Confirmar antes de sair:** ao tocar no link, mostrar um aviso "Abrir o site da Netlify?" com um botão grande "Voltar ao jogo" e um menor "Abrir". O link segue funcional.
3. **Bloquear domínios externos no totem:** usar um navegador de quiosque no Android (ex.: Fully Kiosk Browser) com lista de URLs permitidas, liberando só o domínio do FORJA Match. O site público mantém o link; o aparelho não sai do app. Não exige mudança no código e protege contra outras saídas (ver A5).

**Recomendação:** 1 + 3. A opção 2 é alternativa caso não seja possível controlar o navegador do totem.

**Critérios de aceite**
- [ ] Conferir nos termos do plano open source da Netlify o que é exigido (posição, texto, link) antes de mudar.
- [ ] O link da Netlify continua visível e funcional na página principal.
- [ ] O link fica fora da área de toque do botão "Começar" no totem (1080 × 1920).
- [ ] No totem, um toque no link não tira o visitante do app (bloqueio no navegador de quiosque ou confirmação).
- [ ] Nenhum outro elemento clicável leva para fora do app sem intenção clara.

### A5 · Manifest PWA para instalar no Android em tela cheia
**Labels:** `enhancement`, `area:kiosk-offline`, `P1`

**Contexto:** hoje a tela cheia depende de um toque no botão e se perde ao recarregar. Com um `manifest.webmanifest`, o app pode ser instalado na tela inicial do Android e abrir sempre em tela cheia, na vertical.

**Critérios de aceite**
- [ ] Manifest com `display: "fullscreen"`, `orientation: "portrait"`, `theme_color`, `background_color` e ícones 192/512.
- [ ] Instalação testada no totem Android (1080 × 1920).
- [ ] Documentar no README o passo a passo de preparação do totem.

### A6 · Totens sem ID configurado são registrados como `totem_01`
**Labels:** `bug`, `area:kiosk-offline`, `area:telemetria`, `P1`

**Contexto:** vários totens rodam ao mesmo tempo. Se algum não for configurado (`?kiosk=` ou tela admin), as sessões dele aparecem como `totem_01` e se misturam com as do totem real `totem_01`.

**Critérios de aceite**
- [ ] O valor padrão deixa claro que não foi configurado (ex.: `nao_configurado` ou um ID aleatório persistente).
- [ ] Indicação discreta (visível só para a equipe) quando o totem está sem ID.
- [ ] README documenta o uso de `?kiosk=nome_do_totem`.

### A7 · Sincronização com Firestore pouco resiliente em rede instável
**Labels:** `enhancement`, `area:kiosk-offline`, `area:telemetria`, `P2`

**Contexto:** sem rede, o `setDoc` fica pendente indefinidamente em vez de falhar. A nova tentativa só acontece ao abrir o app ou no evento `online`, que é pouco confiável em Android e Wi-Fi de evento.

**Critérios de aceite**
- [ ] Timeout no envio, com a sessão permanecendo pendente se estourar.
- [ ] Nova tentativa periódica das pendentes (ex.: a cada 2 min e sempre ao voltar à tela inicial).
- [ ] Evitar envios simultâneos da mesma sessão.

### A8 · Service worker nunca atualiza assets já em cache
**Labels:** `bug`, `area:kiosk-offline`, `P2`

**Contexto:** a estratégia é cache-first sem revalidação e com `CACHE_VERSION = "v1"` fixo. Se uma imagem for trocada mantendo o mesmo nome, o totem continua mostrando a antiga.

**Critérios de aceite**
- [ ] Versão do cache derivada do build (hash ou versão do app).
- [ ] Ou estratégia stale-while-revalidate para imagens.
- [ ] Documentar como forçar a atualização em um totem.

### A9 · localStorage cresce sem limite
**Labels:** `enhancement`, `area:kiosk-offline`, `P2`

**Contexto:** todas as sessões ficam para sempre no localStorage, junto com o cache de QR codes. Em eventos longos com vários dias, isso pode atingir o limite (~5 MB) e as gravações começam a falhar sem aviso.

**Critérios de aceite**
- [ ] Sessões sincronizadas há mais de X dias são removidas (as pendentes nunca).
- [ ] Gravação no localStorage protegida com try/catch.
- [ ] A tela admin mostra o espaço utilizado.

---

## Épico B — Telemetria e dados

> Coordenar mudanças de esquema com o painel em Streamlit que consome o Firestore.

### B1 · Registrar sessões abandonadas (taxa de conclusão)
**Labels:** `enhancement`, `area:telemetria`, `P1`

**Contexto:** a sessão só é gravada ao terminar o último card, então todas têm `completed: true`. Não dá para medir a taxa de conclusão nem em qual card as pessoas desistem.

**Critérios de aceite**
- [ ] A sessão é gravada ao começar e atualizada ao terminar ou abandonar.
- [ ] Campos `completed` e `abandonedAtCard` (ou `lastCardIndex`) preenchidos.
- [ ] O CSV do admin e o painel Streamlit tratam sessões incompletas.

### B2 · Versionar regras de segurança do Firestore
**Labels:** `enhancement`, `area:telemetria`, `P1`

**Contexto:** a escrita é feita do navegador sem autenticação, com as chaves públicas do Vite. A proteção depende das regras do Firestore, que não estão no repositório.

**Critérios de aceite**
- [ ] `firestore.rules` no repositório: apenas `create`/`update` em `sessions/{id}`, sem leitura pública, validando campos e tamanhos.
- [ ] Opcional: Firebase App Check ou autenticação anônima.
- [ ] README explica como publicar as regras.

### B3 · Registrar versão do app e do questionário em cada sessão
**Labels:** `enhancement`, `area:telemetria`, `area:match`, `P1`

**Contexto:** `appVersion` está fixo como `"mvp-1"`. Quando a metodologia e os cards mudarem (épico C), o painel precisa separar os dados de cada versão.

**Critérios de aceite**
- [ ] `appVersion` vem do `package.json` ou do commit do build.
- [ ] Novo campo `questionnaireVersion` (ex.: `bartle-v1`, `hexad-v1`).
- [ ] O Streamlit consegue filtrar por versão.

---

## Épico C — Metodologia de match

**Diagnóstico atual:** simulando as 1.024 combinações possíveis de respostas, a distribuição de vencedores é Mortis Pactum 29%, The Party of Losers 19%, Lost Fields 18%, Ismália 14%, You're Gonna Be Late 11% e DECO DICA 10%. Há empate no primeiro lugar em 69 combinações. A causa principal é que a pontuação é uma soma sem normalização: jogos com mais tags e pesos maiores pontuam mais (Mortis Pactum soma 13 pontos de tag; DECO DICA soma 8).

### C1 · Definir nova metodologia de perfil (HEXAD-12)
**Labels:** `research`, `area:match`, `P1`

**Contexto:** sair da inspiração em Bartle e basear o questionário no HEXAD-12, para que o resultado reflita perfis mais diversos e dê chance real a todos os jogos.

**Critérios de aceite**
- [ ] Documento descrevendo as dimensões usadas e como cada card mede cada dimensão.
- [ ] Perfil de cada jogo exposto nas mesmas dimensões, validado pelos times dos jogos.
- [ ] Definição do número de cards (equilíbrio entre precisão e tempo no totem).

### C2 · Normalizar a pontuação para não favorecer jogos com mais tags
**Labels:** `bug`, `area:match`, `P1`

> **Status (12/11/2026):** implementado com similaridade de cosseno + calibração automática de offset por jogo (`calibrateGameOffsets` em `src/utils/match.js`), `appVersion` alterado para `mvp-2`. Só normalizar não bastava: Ismália e Mortis Pactum ficavam com 12–15% por terem perfis sobrepostos. A calibração deixa todos entre 19,6% e 20,4% e muda o vencedor em ~15,7% das combinações. Também resolve o desempate (C3) na prática: 0 empates.

**Critérios de aceite**
- [ ] Pontuação normalizada (ex.: similaridade de cosseno entre o perfil do jogador e o do jogo).
- [ ] Nenhum jogo vence mais de ~1,5× a média esperada na simulação (C4).

### C3 · Critério de desempate explícito
**Labels:** `enhancement`, `area:match`, `P1`

**Contexto:** hoje, em caso de empate, ganha quem vem primeiro em `games.js`.

**Critérios de aceite**
- [ ] Desempate definido (aleatório entre os empatados ou favorecendo o jogo menos indicado no totem).
- [ ] Comportamento coberto por teste.

### C4 · Script e teste de balanceamento dos resultados
**Labels:** `enhancement`, `area:match`, `P1`

**Critérios de aceite**
- [ ] `npm run simulate` mostra a distribuição de vencedores e os empates em todas as combinações (ou numa amostra, se forem muitas).
- [ ] Teste automatizado falha se algum jogo ficar fora da faixa aceitável.
- [ ] O guia de novo jogo (D1) inclui rodar a simulação.

### C5 · Reescrever cards e tags dos jogos na nova metodologia
**Labels:** `enhancement`, `area:match`, `area:conteudo`, `P1`
**Depende de:** C1, C2, C4

**Critérios de aceite**
- [ ] `cards.js` e `games.js` atualizados.
- [ ] Simulação dentro da faixa aceitável.
- [ ] `questionnaireVersion` atualizado (B3).
- [ ] Teste no totem com pessoas reais para ajustar o texto das frases.

---

## Épico D — Conteúdo e documentação

### D1 · Guia "Como adicionar um novo jogo"
**Labels:** `docs`, `area:conteudo`, `P1`

**Contexto:** o layout do totem tem limites concretos que hoje não estão documentados. Medidas atuais no totem 1080 × 1920: o card de resultado tem 820 px de largura, a imagem ocupa ~725 × 460 px com recorte `object-fit: cover`, o título usa até 7,5 rem e a descrição até 2 rem (~40 caracteres por linha).

**Conteúdo proposto para o guia (valores a validar visualmente):**

| Campo | Regra |
| --- | --- |
| `id` | snake_case, único, sem acentos. Não mudar depois de publicado (é usado nos dados). |
| `name` | Até ~22 caracteres para caber em até 2 linhas. |
| `description` | Até ~120 caracteres (no máximo 3 linhas). Uma frase sobre para quem é o jogo. |
| `whereToPlay` | Até ~60 caracteres. |
| `socialUrl` | URL completa, preferencialmente curta (QR code menos denso). |
| `image` | Paisagem 16:10, 1600 × 1000 px, WebP ou JPEG, até 400 KB, com o conteúdo importante no centro (as bordas podem ser cortadas). Salvar em `public/assets/games/` com nome em kebab-case e caminho começando com `/`. |
| `tags` | Seguir as dimensões da metodologia vigente (C1), com soma de pesos dentro da faixa definida. |

**Critérios de aceite**
- [ ] `docs/ADICIONAR-JOGO.md` com campos, limites, especificações de imagem e um exemplo completo.
- [ ] Checklist: imagem otimizada, entrada no cache offline, simulação de balanceamento, teste visual no totem.
- [ ] Link no README.

### D2 · Otimizar imagens dos jogos
**Labels:** `enhancement`, `area:conteudo`, `area:kiosk-offline`, `P2`

**Contexto:** `deco-dica.png` tem 6,8 MB e `lost-fields.jpeg` tem 2,4 MB; o total passa de 12 MB. Isso pesa no primeiro carregamento e no cache do totem.

**Critérios de aceite**
- [ ] Todas as imagens seguem a especificação do D1.
- [ ] Total de imagens dos jogos abaixo de ~2 MB.

### D3 · Caminho da imagem de You're Gonna Be Late sem `/`
**Labels:** `bug`, `area:conteudo`, `P2`

**Contexto:** em `games.js`, o caminho é `assets/games/...` (relativo), enquanto os demais são `/assets/games/...`. Funciona na raiz do site, mas quebra se o app for servido em outra rota.

**Critérios de aceite**
- [ ] Caminho corrigido para `/assets/games/you-are-gonna-be-late.png`.

### D4 · Atualizar README
**Labels:** `docs`, `P3`

**Critérios de aceite**
- [ ] Remover a menção ao `netlify.toml` (não existe) ou criar o arquivo.
- [ ] Incluir `VITE_FIREBASE_MEASUREMENT_ID` na lista de variáveis.
- [ ] Documentar `?kiosk=`, o atalho Ctrl+Shift+A e o service worker.
- [ ] Mencionar o painel Streamlit de análise.
- [ ] Atualizar a árvore de pastas.

---

## Épico E — Qualidade de código

### E1 · Lista de assets duplicada entre `sw.js` e `assetCache.js`
**Labels:** `chore`, `area:codigo`, `P2`

**Contexto:** a lista de imagens dos jogos está fixa em `public/sw.js` e é derivada de `games.js` em `assetCache.js`. Adicionar um jogo exige lembrar de editar os dois arquivos. Pode ser resolvida junto com A2.

**Critérios de aceite**
- [ ] Uma única fonte da lista, gerada no build.

### E2 · Carregar o three.js sob demanda (bundle de 1,6 MB)
**Labels:** `enhancement`, `area:codigo`, `P2`

**Contexto:** o JS final tem 1,6 MB (458 KB gzip), quase todo do three.js. O jogo e o resultado não precisam do 3D.

**Critérios de aceite**
- [ ] `CartuchoFORJA` carregado com `React.lazy` e fallback visual.
- [ ] Bundle inicial menor que 500 KB.

### E3 · Remover assets não utilizados e corrigir nome do `FORJAHub.glb`
**Labels:** `chore`, `area:codigo`, `P3`

**Contexto:** nenhum código usa estes arquivos: `src/assets/FORJAHub.glb`, `src/assets/FORJAmatch.glb` (cópia do que está em `public/`), `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/f_forja_white.png` e `public/Ismalia.png` (duplicado de `public/assets/games/ismalia.png`).

**Critérios de aceite**
- [ ] `FORJAHub.glb` renomeado para `FORJA.glb` (se for usado) ou removido.
- [ ] Demais arquivos removidos.

### E4 · `standLocation` definido mas não exibido
**Labels:** `chore`, `area:conteudo`, `P3`

**Critérios de aceite**
- [ ] Decidir: exibir na tela de resultado (o README promete) ou remover o campo.

### E5 · Código morto e duplicado em componentes
**Labels:** `chore`, `area:codigo`, `P3`

**Critérios de aceite**
- [ ] Remover as props não usadas `answers` e `session` passadas à `ResultScreen`.
- [ ] Remover o CSS `.debug-result` sem uso.
- [ ] Extrair a lógica de tela cheia (duplicada em `StartScreen` e `AdminExport`) para um hook.

---

## Épico F — Futuro

### F1 · Carregar jogos e cards de fonte externa por evento
**Labels:** `enhancement`, `area:conteudo`, `Futuro`

**Contexto:** hoje mudar jogos ou frases exige alterar o código e fazer um novo deploy. A ideia é carregar o conteúdo (Firestore ou JSON) por evento, sem perder o funcionamento offline.

**Critérios de aceite**
- [ ] Conteúdo definido por evento, com cache local e fallback para a última versão baixada.
- [ ] Validação do conteúdo (limites do D1) antes de publicar.
- [ ] Imagens entram automaticamente no cache offline.

---

## Ordem sugerida

1. **Antes do próximo evento:** A1, A2, A3, A4, A6.
2. **Metodologia (foco atual):** B3 → C1 → C2, C3, C4 → C5, junto com D1.
3. **Dados:** B1, B2.
4. **Robustez e desempenho:** A5, A7, A8, A9, D2, E1, E2.
5. **Limpeza:** D3, D4, E3, E4, E5.
6. **Futuro:** F1.
