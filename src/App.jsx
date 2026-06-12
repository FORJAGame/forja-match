import { useState } from "react";

import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";

import { cards } from "./data/cards";
import { games } from "./data/games";
import { updatePlayerProfile, calculateMatch } from "./utils/match";

function App() {
  const [screen, setScreen] = useState("start");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [playerProfile, setPlayerProfile] = useState({});
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const currentCard = cards[currentCardIndex];

  function startGame() {
    setScreen("game");
    setCurrentCardIndex(0);
    setPlayerProfile({});
    setAnswers([]);
    setResult(null);
  }

  function handleAnswer(direction) {
    const card = cards[currentCardIndex];

    const updatedProfile = updatePlayerProfile(playerProfile, card, direction);

    const updatedAnswers = [
      ...answers,
      {
        cardId: card.id,
        direction,
        answeredAt: new Date().toISOString()
      }
    ];

    setPlayerProfile(updatedProfile);
    setAnswers(updatedAnswers);

    const isLastCard = currentCardIndex === cards.length - 1;

    if (isLastCard) {
      const matchResult = calculateMatch(updatedProfile, games);

      setResult(matchResult);
      setScreen("result");
      return;
    }

    setCurrentCardIndex(currentCardIndex + 1);
  }

  function restartGame() {
    setScreen("start");
    setCurrentCardIndex(0);
    setPlayerProfile({});
    setAnswers([]);
    setResult(null);
  }

  return (
    <main className="app">
      {screen === "start" && <StartScreen onStart={startGame} />}

      {screen === "game" && currentCard && (
        <GameScreen
          card={currentCard}
          currentIndex={currentCardIndex}
          totalCards={cards.length}
          onAnswer={handleAnswer}
        />
      )}

      {screen === "result" && result && (
        <ResultScreen
          result={result}
          answers={answers}
          onRestart={restartGame}
        />
      )}
    </main>
  );
}

export default App;
