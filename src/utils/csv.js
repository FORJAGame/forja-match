function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  const escapedValue = stringValue.replaceAll('"', '""');

  if (
    escapedValue.includes(",") ||
    escapedValue.includes('"') ||
    escapedValue.includes("\n")
  ) {
    return `"${escapedValue}"`;
  }

  return escapedValue;
}

function rowsToCSV(rows) {
  return rows
    .map((row) => row.map((value) => escapeCSVValue(value)).join(","))
    .join("\n");
}

function downloadCSV(filename, csvContent) {
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function getSessionDurationInSeconds(session) {
  if (!session.startedAt || !session.finishedAt) {
    return "";
  }

  const startedAt = new Date(session.startedAt);
  const finishedAt = new Date(session.finishedAt);

  return Math.round((finishedAt - startedAt) / 1000);
}

export function exportSessionsCSV(sessions) {
  const rows = [
    [
      "session_id",
      "kiosk_id",
      "started_at",
      "finished_at",
      "duration_seconds",
      "completed",
      "result_game_id",
      "result_game_name",
      "result_score",
      "total_answers",
      "accepted_answers",
      "rejected_answers",
      "synced",
    ],
  ];

  sessions.forEach((session) => {
    const acceptedAnswers = session.answers.filter(
      (answer) => answer.direction === "right",
    ).length;

    const rejectedAnswers = session.answers.filter(
      (answer) => answer.direction === "left",
    ).length;

    rows.push([
      session.id,
      session.kioskId,
      session.startedAt,
      session.finishedAt,
      getSessionDurationInSeconds(session),
      session.completed,
      session.result?.gameId,
      session.result?.gameName,
      session.result?.score,
      session.answers.length,
      acceptedAnswers,
      rejectedAnswers,
      session.synced,
    ]);
  });

  const csv = rowsToCSV(rows);
  downloadCSV("forja-match-sessoes.csv", csv);
}

export function exportAnswersCSV(sessions) {
  const rows = [
    [
      "session_id",
      "kiosk_id",
      "card_id",
      "card_text",
      "direction",
      "answered_at",
      "result_game_id",
      "result_game_name",
    ],
  ];

  sessions.forEach((session) => {
    session.answers.forEach((answer) => {
      rows.push([
        session.id,
        session.kioskId,
        answer.cardId,
        answer.cardText,
        answer.direction,
        answer.answeredAt,
        session.result?.gameId,
        session.result?.gameName,
      ]);
    });
  });

  const csv = rowsToCSV(rows);
  downloadCSV("forja-match-respostas.csv", csv);
}

export function exportRankingCSV(sessions) {
  const rows = [
    [
      "session_id",
      "kiosk_id",
      "rank",
      "game_id",
      "game_name",
      "score",
      "winner_game_id",
      "winner_game_name",
    ],
  ];

  sessions.forEach((session) => {
    const ranking = session.result?.ranking || [];

    ranking.forEach((item, index) => {
      rows.push([
        session.id,
        session.kioskId,
        index + 1,
        item.gameId,
        item.gameName,
        item.score,
        session.result?.gameId,
        session.result?.gameName,
      ]);
    });
  });

  const csv = rowsToCSV(rows);
  downloadCSV("forja-match-ranking.csv", csv);
}
