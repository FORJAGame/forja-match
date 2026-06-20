import { QRCodeSVG } from "qrcode.react";
import forja_logo from "/forja_match_logo.png";

function ResultScreen({ result, onRestart }) {
  const game = result.game;

  return (
    <section className="screen result-screen">
      <img className="screen-logo result-logo" src={forja_logo} alt="FORJA Match"/>

      <p className="result-label">Você deu match com</p>

      <h1 className="result-title">{game.name}</h1>

      <div className="result-card">
        {game.image && (
          <img
            className="game-image"
            src={game.image}
            alt={`Imagem do jogo ${game.name}`}
          />
        )}

        <p className="game-description">{game.description}</p>

        <div className="result-info">
          <p>
            <strong>Onde jogar</strong>
            <span>{game.whereToPlay}</span>
          </p>

          {game.socialUrl && (
            <p className="result-social">
              <strong>Siga o jogo</strong>
              <span className="result-social-hint">
                Aponte a câmera para acompanhar nas redes sociais
              </span>
              <span className="social-qr">
                <QRCodeSVG
                  value={game.socialUrl}
                  size={256}
                  level="M"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#111111"
                />
              </span>
            </p>
          )}
        </div>
      </div>

      <button className="primary-button" onClick={onRestart}>
        Jogar novamente
      </button>
    </section>
  );
}

export default ResultScreen;
