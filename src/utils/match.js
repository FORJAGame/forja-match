const ACCEPT_MULTIPLIER = 1;
const REJECT_MULTIPLIER = -0.5;

// Calibração: até este número de cards todas as combinações são testadas;
// acima disso, usa-se uma amostra fixa (determinística) de respostas.
const MAX_EXHAUSTIVE_CARDS = 12;
const CALIBRATION_SAMPLE_SIZE = 4096;
const CALIBRATION_MAX_ITERATIONS = 400;
const CALIBRATION_TOLERANCE = 0.01;
const CALIBRATION_LEARNING_RATE = 0.05;

export function updatePlayerProfile(profile, card, direction) {
  const multiplier =
    direction === "right" ? ACCEPT_MULTIPLIER : REJECT_MULTIPLIER;
  const updatedProfile = { ...profile };

  for (const tag in card.tags) {
    updatedProfile[tag] =
      (updatedProfile[tag] || 0) + card.tags[tag] * multiplier;
  }

  return updatedProfile;
}

function vectorLength(vector) {
  let sum = 0;

  for (const key in vector) {
    sum += vector[key] * vector[key];
  }

  return Math.sqrt(sum);
}

// Similaridade de cosseno entre o perfil do jogador e as tags do jogo.
// Normaliza pelo tamanho dos dois vetores, para que jogos com mais tags
// (ou pesos maiores) não ganhem vantagem só por isso.
export function calculateGameScore(playerProfile, game) {
  const playerLength = vectorLength(playerProfile);
  const gameLength = vectorLength(game.tags);

  if (playerLength === 0 || gameLength === 0) {
    return 0;
  }

  let dotProduct = 0;

  for (const tag in game.tags) {
    dotProduct += (playerProfile[tag] || 0) * game.tags[tag];
  }

  return dotProduct / (playerLength * gameLength);
}

// Ajusta um pequeno deslocamento (offset) por jogo para que, considerando
// todas as respostas possíveis, cada jogo seja indicado com frequência
// parecida. Só muda o resultado em casos de perfil "dividido" entre jogos.
export function calibrateGameOffsets(cards, games) {
  if (games.length < 2 || cards.length === 0) {
    return {};
  }

  const scores = buildAnswerProfiles(cards).map((profile) =>
    games.map((game) => calculateGameScore(profile, game)),
  );
  const offsets = games.map(() => 0);
  const target = 1 / games.length;

  for (let iteration = 0; iteration < CALIBRATION_MAX_ITERATIONS; iteration += 1) {
    const wins = games.map(() => 0);

    for (const gameScores of scores) {
      wins[indexOfBest(gameScores, offsets)] += 1;
    }

    const shares = wins.map((count) => count / scores.length);

    if (Math.max(...shares) - Math.min(...shares) < CALIBRATION_TOLERANCE) {
      break;
    }

    shares.forEach((share, index) => {
      offsets[index] += CALIBRATION_LEARNING_RATE * (target - share);
    });
  }

  return Object.fromEntries(games.map((game, index) => [game.id, offsets[index]]));
}

function indexOfBest(gameScores, offsets) {
  let bestIndex = 0;

  for (let index = 1; index < gameScores.length; index += 1) {
    if (gameScores[index] + offsets[index] > gameScores[bestIndex] + offsets[bestIndex]) {
      bestIndex = index;
    }
  }

  return bestIndex;
}

function buildAnswerProfiles(cards) {
  const exhaustive = cards.length <= MAX_EXHAUSTIVE_CARDS;
  const total = exhaustive ? 2 ** cards.length : CALIBRATION_SAMPLE_SIZE;
  const random = createSeededRandom(42);
  const profiles = [];

  for (let run = 0; run < total; run += 1) {
    let profile = {};

    cards.forEach((card, index) => {
      const accepted = exhaustive ? (run >> index) & 1 : random() < 0.5;
      profile = updatePlayerProfile(profile, card, accepted ? "right" : "left");
    });

    profiles.push(profile);
  }

  return profiles;
}

// PRNG simples (mulberry32) para a amostra ser sempre a mesma.
function createSeededRandom(seed) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function calculateMatch(playerProfile, games, offsets = {}) {
  const ranking = games
    .map((game) => {
      return {
        game,
        score: calculateGameScore(playerProfile, game) + (offsets[game.id] || 0),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    game: ranking[0]?.game || null,
    score: ranking[0]?.score || 0,
    ranking,
  };
}
