function GameScreen({ card, currentIndex, totalCards, onAnswer }) {
  const progress = currentIndex + 1;

  return (
    <section className="screen game-screen">
      <header className="game-header">
        <span>
          Frase {progress} de {totalCards}
        </span>

        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(progress / totalCards) * 100}%` }}
          />
        </div>
      </header>

      <article className="match-card">
        <p>{card.text}</p>
      </article>

      <div className="actions">
        <button
          className="choice-button reject-button"
          onClick={() => onAnswer("left")}
        >
          🙅 Não curto
        </button>

        <button
          className="choice-button accept-button"
          onClick={() => onAnswer("right")}
        >
          Curto 🙆‍♂️
        </button>
      </div>
    </section>
  );
}

export default GameScreen;
