import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "./firebase";

import {
  getUnsyncedSessions,
  markSessionAsSynced,
  saveLocalSession,
} from "./storage";

function sanitizeSessionForFirestore(session) {
  return {
    id: session.id,
    kioskId: session.kioskId,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    completed: session.completed,
    answers: session.answers,
    result: session.result,
    // mvp-2: pontuação por similaridade de cosseno + calibração por jogo.
    // mvp-3: Pong-Champs + card_11 (competição/arcade).
    // mvp-4: Arrudiando Recife + card_12 (jogos de mesa com amigos/família).
    // mvp-5: questionário reescrito com 10 cards curtos e específicos.
    //        Os ids card_01..card_10 têm textos novos a partir desta versão.
    appVersion: "mvp-5",
    updatedAt: serverTimestamp(),
  };
}

export async function saveSession(session) {
  saveLocalSession({
    ...session,
    synced: false,
  });

  try {
    await setDoc(
      doc(db, "sessions", session.id),
      sanitizeSessionForFirestore(session),
    );

    markSessionAsSynced(session.id);
  } catch (error) {
    console.error("Erro ao sincronizar sessão com Firebase:", error);
  }
}

export async function syncPendingSessions() {
  const sessions = getUnsyncedSessions();

  for (const session of sessions) {
    try {
      await setDoc(
        doc(db, "sessions", session.id),
        sanitizeSessionForFirestore(session),
      );

      markSessionAsSynced(session.id);
    } catch (error) {
      console.error("Erro ao sincronizar sessão pendente:", error);
    }
  }
}
