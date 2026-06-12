import { cards } from "./data/cards";
import { games } from "./data/games";
import { updatePlayerProfile, calculateMatch } from "./utils/match";
import forja_logo from './assets/forja_match_logo.png'

function App() {
  let playerProfile = {};

  playerProfile = updatePlayerProfile(playerProfile, cards[0], "right");
  playerProfile = updatePlayerProfile(playerProfile, cards[1], "right");
  playerProfile = updatePlayerProfile(playerProfile, cards[2], "right");
  playerProfile = updatePlayerProfile(playerProfile, cards[5], "right");

  const result = calculateMatch(playerProfile, games);

  return (
    <main className="app">
      <header className='title'>
        <img id='forja-logo' src={forja_logo} alt="" srcset="" />
        <h1>FORJA Match</h1>
      </header>

      <section>
        <h2>Teste do algoritmo</h2>

        <p>
          O jogo que deu match foi:
        </p>

        <h3>{result.game.name}</h3>

        <p>{result.game.description}</p>

        <h2>Ranking</h2>

        <ol>
          {result.ranking.map((item) => (
            <li key={item.game.id}>
              {item.game.name} — {item.score} pontos
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default App;
