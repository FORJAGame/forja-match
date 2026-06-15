import forja_logo from "../assets/forja_match_logo.png";

function StartScreen({ onStart }) {
  return (
    <section className="screen start-screen">
      <img className="home-logo" src={forja_logo} alt="FORJA Match"/>

      <p className="subtitle">
        Descubra qual jogo da FORJA combina mais com você
      </p>

      <p className="instructions">
        Arraste para a direita se curtir. Para a esquerda se não for sua vibe.
      </p>

      <button className="primary-button" onClick={onStart}>
        Começar
      </button>
    </section>
  );
}

export default StartScreen;
