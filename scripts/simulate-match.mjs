// Simula todas as combinações de respostas e mostra quantas vezes cada jogo vence,
// antes e depois da calibração por jogo. Uso: npm run simulate
import { cards } from "../src/data/cards.js";
import { games } from "../src/data/games.js";
import {
  calculateMatch,
  calibrateGameOffsets,
  updatePlayerProfile,
} from "../src/utils/match.js";

const MAX_EXHAUSTIVE_CARDS = 20;
const SAMPLE_SIZE = 200_000;

const exhaustive = cards.length <= MAX_EXHAUSTIVE_CARDS;
const total = exhaustive ? 2 ** cards.length : SAMPLE_SIZE;
const offsets = calibrateGameOffsets(cards, games);

const winsRaw = Object.fromEntries(games.map((game) => [game.id, 0]));
const winsCalibrated = { ...winsRaw };
let changedWinner = 0;
let ties = 0;

for (let run = 0; run < total; run += 1) {
  let profile = {};

  cards.forEach((card, index) => {
    const accepted = exhaustive ? (run >> index) & 1 : Math.random() < 0.5;
    profile = updatePlayerProfile(profile, card, accepted ? "right" : "left");
  });

  const raw = calculateMatch(profile, games);
  const calibrated = calculateMatch(profile, games, offsets);

  winsRaw[raw.game.id] += 1;
  winsCalibrated[calibrated.game.id] += 1;

  if (raw.game.id !== calibrated.game.id) changedWinner += 1;
  if (calibrated.ranking[1]?.score === calibrated.score) ties += 1;
}

const percent = (count) => Number(((count / total) * 100).toFixed(1));
const cardTags = new Set(cards.flatMap((card) => Object.keys(card.tags)));
const ideal = 100 / games.length;

console.log(
  `\n${exhaustive ? "Todas as" : "Amostra de"} ${total} combinações · ${cards.length} cards · ${games.length} jogos`,
);
console.log(`Ideal por jogo: ${ideal.toFixed(1)}%\n`);

console.table(
  games
    .map((game) => ({
      jogo: game.name,
      "% sem calibração": percent(winsRaw[game.id]),
      "% calibrado": percent(winsCalibrated[game.id]),
      offset: Number(offsets[game.id].toFixed(3)),
    }))
    .sort((a, b) => b["% calibrado"] - a["% calibrado"]),
);

console.log(`Vencedor alterado pela calibração: ${percent(changedWinner)}% das combinações`);
console.log(`Empates no 1º lugar: ${ties} (${percent(ties)}%)`);

const warnings = [];

for (const game of games) {
  const rawShare = percent(winsRaw[game.id]);
  const unknownTags = Object.keys(game.tags).filter((tag) => !cardTags.has(tag));

  if (rawShare < ideal / 2) {
    warnings.push(
      `${game.name}: sem calibração vence pouco (${rawShare}%). Revise as tags; o perfil pode estar sobreposto ao de outro jogo.`,
    );
  }

  if (unknownTags.length > 0) {
    warnings.push(`${game.name}: tags sem card correspondente: ${unknownTags.join(", ")}`);
  }
}

if (warnings.length > 0) {
  console.log("\nAtenção:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
