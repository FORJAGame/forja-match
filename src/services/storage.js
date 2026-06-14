const STORAGE_KEY = "forja_match_sessions";

export function getLocalSessions() {
  const storedSessions = localStorage.getItem(STORAGE_KEY);

  if (!storedSessions) {
    return [];
  }

  try {
    return JSON.parse(storedSessions);
  } catch (error) {
    console.error("Erro ao ler sessões do localStorage:", error);
    return [];
  }
}

export function saveLocalSession(session) {
  const sessions = getLocalSessions();

  const updatedSessions = [
    ...sessions.filter((storedSession) => storedSession.id !== session.id),
    {
      ...session,
      synced: session.synced ?? false,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
}

export function getLocalSessionCount() {
  return getLocalSessions().length;
}

export function clearLocalSessions() {
  localStorage.removeItem(STORAGE_KEY);
}
