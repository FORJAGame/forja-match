import SwipeCard from "./SwipeCard";
import forja_logo from "/forja_match_logo.png";

function GameScreen({ card, currentIndex, totalCards, onAnswer }) {
  const progress = currentIndex + 1;

  return (
    <section className="screen game-screen">
      <header className="game-header">
        <img className="screen-logo" src={forja_logo} alt="FORJA Match"/>

        <div className="progress-info">
          <span>
            Frase {progress} de {totalCards}
          </span>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(progress / totalCards) * 100}%` }}
            />
          </div>
        </div>

        <p className="swipe-hint">Arraste o card ou use os botões abaixo</p>
      </header>

      <div className="swipe-area">
        <SwipeCard key={card.id} card={card} onSwipe={onAnswer} />
      </div>

      <div className="actions">
        <button
          className="choice-button reject-button"
          onClick={() => onAnswer("left")}
        >
          Não é minha vibe
        </button>

        <button
          className="choice-button accept-button"
          onClick={() => onAnswer("right")}
        >
          Dá match
        </button>
      </div>
    </section>
  );
}

export default GameScreen;
