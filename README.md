# FORJA Match

## Qual o jogo da FORJA que dá match com você?

**FORJA Match** é um jogo web de ativação da [FORJA Game Studio](https://forjagame.com), pensado para uso em totens touch durante eventos, exposições e ações institucionais.

A experiência é inspirada em mecânicas de swipe: o jogador recebe frases relacionadas a preferências, mecânicas e dinâmicas de jogos e deve arrastar para a direita ou para a esquerda para indicar se aquela frase combina ou não com ele.

Ao final, o sistema calcula qual jogo da FORJA “dá match” com o perfil do jogador e exibe uma tela de resultado com:

* o jogo indicado;
* uma breve justificativa do match;
* onde jogar o jogo;
* link para seguir o jogo nas redes sociais;
* onde encontrar o estande da FORJA;
* possibilidade de reiniciar a experiência.

O jogo também registra estatísticas de uso, como sessões iniciadas, respostas dadas, jogos mais indicados e taxa de conclusão.

---

## Objetivos do projeto

* Criar uma experiência rápida, visual e divertida para o público de eventos;
* Direcionar visitantes para jogos específicos da FORJA;
* Ajudar o público a descobrir jogos com base em preferências pessoais;
* Coletar estatísticas anônimas de uso;
* Funcionar bem em totens touch.

---

## Totens

* Touch Screen
* Sistema: Android
* Resolução: 1080 x 1920
* Altura: 1,70m

---

## Stack do projeto

A stack escolhida para o projeto é:

* **Vite**;
* **React**;
* **CSS puro**;
* **Motion**;
* **Firebase Firestore**;
* **localStorage**;
* **Netlify**.

---

## Estrutura inicial do projeto

```txt
forja-match/
  public/
    assets/
      logo-forja.png
      games/
  src/
    components/
      StartScreen.jsx
      SwipeCard.jsx
      GameScreen.jsx
      ResultScreen.jsx
      AdminExport.jsx
    data/
      cards.js
      games.js
    services/
      firebase.js
      analytics.js
      storage.js
    utils/
      match.js
      csv.js
    App.jsx
    main.jsx
    styles.css
  .env.example
  package.json
  README.md
```

---

## Pré-requisitos

Antes de iniciar o desenvolvimento, instalar:

* Node.js;
* npm;
* Git.

Recomenda-se usar uma versão atual do Node.js compatível com o Vite.

Para verificar a instalação:

```bash
node -v
npm -v
git --version
```

---

## Checklist de entrega

* [ ] Projeto criado com Vite + React;
* [ ] Motion instalado e funcionando;
* [ ] Firebase configurado;
* [ ] Netlify configurado;
* [ ] Cards cadastrados;
* [ ] Jogos cadastrados;
* [ ] Tela inicial pronta;
* [ ] Tela de jogo pronta;
* [ ] Swipe funcionando;
* [ ] Botões funcionando;
* [ ] Algoritmo de match funcionando;
* [ ] Tela de resultado pronta;
* [ ] Estatísticas salvas localmente;
* [ ] Estatísticas enviadas ao Firebase;
* [ ] Exportação CSV funcionando;
* [ ] Teste em tela touch realizado;
* [ ] Teste sem internet realizado;
* [ ] Deploy final realizado.
