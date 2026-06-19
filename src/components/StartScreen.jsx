import { useEffect, useState } from "react";
import HeartParticles from "./HeartParticles";
import CartuchoFORJA from "./CartuchoFORJA";
import forja_logo from "/forja_match_logo.png";

function StartScreen({ onStart }) {
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  async function handleToggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch (error) {
      console.error("Erro ao alternar tela cheia:", error);
      alert(
        "Não foi possível ativar a tela cheia. Tente novamente pelo navegador.",
      );
    }
  }

  return (
    <section className="screen start-screen">
      <HeartParticles />

      <div className="start-content">
        <img className="home-logo" src={forja_logo} alt="FORJA Match" />

        <CartuchoFORJA />

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
        <footer className="open-source-footer">
          <a href="https://www.netlify.com/" target="_blank" rel="noreferrer">
            This site is powered by Netlify
          </a>
        </footer>
        <button
          className="fullscreen-button"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Sair da tela cheia" : "Ativar tela cheia"}
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Sair da tela cheia" : "Ativar tela cheia"}
        >
          <span className="fullscreen-icon" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default StartScreen;
