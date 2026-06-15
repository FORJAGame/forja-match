import HeartParticles from "./HeartParticles";
import forja_logo from "/forja_match_logo.png";

function StartScreen({ onStart }) {
  return (
    <section className="screen start-screen">
      <HeartParticles />

      <div className="start-content">
        <img className="home-logo" src={forja_logo} alt="FORJA Match"/>

        <p className="subtitle">
          Descubra qual jogo da FORJA combina mais com você
        </p>

        <p className="instructions">
          Arraste para a direita se curtir. Para a esquerda se não for sua vibe.
        </p>

        <div className="start-button-wrap">
          <span className="button-pulse button-pulse-1" />
          <span className="button-pulse button-pulse-2" />

          <button className="primary-button start-button" onClick={onStart}>
            Começar
          </button>

          <span className="button-spark spark-1">♥</span>
          <span className="button-spark spark-2">♥</span>
          <span className="button-spark spark-3">♥</span>
          <span className="button-spark spark-4">♥</span>
        </div>
      </div>
    </section>
  );
}

export default StartScreen;
