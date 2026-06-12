function StartScreen({ onStart }) {
  return (
    <section className="screen start-screen">
      <div className="brand-mark">FORJA</div>

      <h1>FORJA Match</h1>

      <p className="subtitle">
        Descubra qual jogo da FORJA combina mais com você.
      </p>

      <p className="instructions">
        Leia as frases e escolha se elas têm ou não a ver com seu jeito de jogar.
      </p>

      <button className="primary-button" onClick={onStart}>
        Começar
      </button>
    </section>
  );
}

export default StartScreen;
