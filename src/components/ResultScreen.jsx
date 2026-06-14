function ResultScreen({ result, answers, session, onRestart }) {
  const game = result.game;

  return (
    <section className="screen result-screen">
      <p className="result-label">Você deu match com</p>

      <h1>{game.name}</h1>

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
            <strong>Onde jogar:</strong>
            <br />
            {game.whereToPlay}
          </p>

          <p>
            <strong>Estande:</strong>
            <br />
            {game.standLocation}
          </p>

          {game.socialUrl && (
            <p>
              <strong>Redes sociais:</strong>
              <br />
              <a href={game.socialUrl} target="_blank" rel="noreferrer">
                Acompanhar o jogo
              </a>
            </p>
          )}
        </div>
      </div>

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

      <button className="primary-button" onClick={onRestart}>
        Jogar novamente
      </button>
    </section>
  );
}

export default ResultScreen;
