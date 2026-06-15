import forja_logo from "/forja_match_logo.png";

function ResultScreen({ result, answers, session, onRestart }) {
  const game = result.game;
  const shouldShowDebug = import.meta.env.DEV;

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

          <p>
            <strong>Onde encontrar a FORJA</strong>
            <span>{game.standLocation}</span>
          </p>

          {game.socialUrl && (
            <p>
              <strong>Siga o jogo</strong>
              <a href={game.socialUrl} target="_blank" rel="noreferrer">
                Acompanhar nas redes sociais
              </a>
            </p>
          )}
        </div>
      </div>

      {shouldShowDebug && (
        <div className="debug-result">
          <p>
            Pontuação do match: <strong>{result.score}</strong>
          </p>

          <p>
            Respostas registradas: <strong>{answers.length}</strong>
          </p>

          {session && (
            <p>
              Sessão salva localmente: <strong>{session.id}</strong>
            </p>
          )}
        </div>
      )}

      <button className="primary-button" onClick={onRestart}>
        Jogar novamente
      </button>
    </section>
  );
}

export default ResultScreen;
