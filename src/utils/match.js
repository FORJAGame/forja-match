export function updatePlayerProfile(profile, card, direction) {
  const multiplier = direction === "right" ? 1 : -0.5;
  const updatedProfile = { ...profile };

  for (const tag in card.tags) {
    updatedProfile[tag] =
      (updatedProfile[tag] || 0) + card.tags[tag] * multiplier;
  }

  return updatedProfile;
}

export function calculateGameScore(playerProfile, game) {
  let score = 0;

  for (const tag in game.tags) {
    const playerValue = playerProfile[tag] || 0;
    const gameValue = game.tags[tag];

    score += playerValue * gameValue;
  }

  return score;
}

export function calculateMatch(playerProfile, games) {
  const ranking = games
    .map((game) => {
      return {
        game,
        score: calculateGameScore(playerProfile, game),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    game: ranking[0]?.game || null,
    score: ranking[0]?.score || 0,
    ranking,
  };
}
