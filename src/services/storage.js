const STORAGE_KEY = "forja_match_sessions";
const KIOSK_ID_KEY = "forja_match_kiosk_id";

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

export function markSessionAsSynced(sessionId) {
  const sessions = getLocalSessions();

  const updatedSessions = sessions.map((session) => {
    if (session.id === sessionId) {
      return {
        ...session,
        synced: true,
        syncedAt: new Date().toISOString(),
      };
    }

    return session;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
}

export function getUnsyncedSessions() {
  return getLocalSessions().filter((session) => !session.synced);
}

export function getLocalSessionCount() {
  return getLocalSessions().length;
}

export function clearLocalSessions() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getKioskId() {
  const params = new URLSearchParams(window.location.search);
  const kioskIdFromUrl = params.get("kiosk");

  if (kioskIdFromUrl) {
    localStorage.setItem(KIOSK_ID_KEY, kioskIdFromUrl);
    return kioskIdFromUrl;
  }

  return localStorage.getItem(KIOSK_ID_KEY) || "totem_01";
}

export function setKioskId(kioskId) {
  const sanitizedKioskId = kioskId.trim() || "totem_01";

  localStorage.setItem(KIOSK_ID_KEY, sanitizedKioskId);

  return sanitizedKioskId;
}
