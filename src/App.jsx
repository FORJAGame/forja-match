import { useState } from "react";

import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";

import { cards } from "./data/cards";
import { games } from "./data/games";
import { updatePlayerProfile, calculateMatch } from "./utils/match";
import { saveLocalSession } from "./services/storage";

function createSession() {
  return {
    id: crypto.randomUUID(),
    kioskId: getKioskId(),
    startedAt: new Date().toISOString(),
    finishedAt: null,
    completed: false,
    answers: [],
    result: null
  };
}

function getKioskId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("kiosk") || "totem_01";
}

function App() {
  const [screen, setScreen] = useState("start");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [playerProfile, setPlayerProfile] = useState({});
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);

  const currentCard = cards[currentCardIndex];

  function startGame() {
    const newSession = createSession();

    setScreen("game");
    setCurrentCardIndex(0);
    setPlayerProfile({});
    setAnswers([]);
    setResult(null);
    setCurrentSession(newSession);
  }

  function handleAnswer(direction) {
    const card = cards[currentCardIndex];

    const updatedProfile = updatePlayerProfile(playerProfile, card, direction);

    const answer = {
      cardId: card.id,
      cardText: card.text,
      direction,
      answeredAt: new Date().toISOString()
    };

    const updatedAnswers = [...answers, answer];

    setPlayerProfile(updatedProfile);
    setAnswers(updatedAnswers);

    const isLastCard = currentCardIndex === cards.length - 1;

    if (isLastCard) {
      const matchResult = calculateMatch(updatedProfile, games);

      const completedSession = {
        ...currentSession,
        finishedAt: new Date().toISOString(),
        completed: true,
        answers: updatedAnswers,
        result: {
          gameId: matchResult.game.id,
          gameName: matchResult.game.name,
          score: matchResult.score,
          ranking: matchResult.ranking.map((item) => ({
            gameId: item.game.id,
            gameName: item.game.name,
            score: item.score
          }))
        }
      };

      saveLocalSession(completedSession);

      setCurrentSession(completedSession);
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
    setCurrentSession(null);
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
          session={currentSession}
          onRestart={restartGame}
        />
      )}
    </main>
  );
}

export default App;
