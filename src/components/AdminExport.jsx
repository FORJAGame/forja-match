import { useState } from "react";
import { syncPendingSessions } from "../services/analytics";

import {
  clearLocalSessions,
  getLocalSessions
} from "../services/storage";

import {
  exportAnswersCSV,
  exportRankingCSV,
  exportSessionsCSV
} from "../utils/csv";

function AdminExport({ onBack }) {
  const [sessions, setSessions] = useState(getLocalSessions());

  const completedSessions = sessions.filter((session) => session.completed);
  const syncedSessions = sessions.filter((session) => session.synced);
  const unsyncedSessions = sessions.filter((session) => !session.synced);

  const totalAnswers = sessions.reduce((total, session) => {
    return total + session.answers.length;
  }, 0);

  function refreshSessions() {
    setSessions(getLocalSessions());
  }

  function handleExportSessions() {
    exportSessionsCSV(sessions);
  }

  function handleExportAnswers() {
    exportAnswersCSV(sessions);
  }

  function handleExportRanking() {
    exportRankingCSV(sessions);
  }

  function handleClearSessions() {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar todos os dados locais deste navegador?"
    );

    if (!confirmed) {
      return;
    }

    clearLocalSessions();
    refreshSessions();
  }

  async function handleSyncPendingSessions() {
    await syncPendingSessions();
    refreshSessions();
  }

  return (
    <section className="screen admin-screen">
      <div className="brand-mark">ADMIN</div>

      <h1>Dados locais</h1>

      <p className="instructions">
        Esta tela permite exportar as estatísticas salvas neste navegador.
      </p>

      <div className="admin-stats">
        <div>
          <strong>{sessions.length}</strong>
          <span>Sessões salvas</span>
        </div>

        <div>
          <strong>{completedSessions.length}</strong>
          <span>Sessões concluídas</span>
        </div>

        <div>
          <strong>{totalAnswers}</strong>
          <span>Respostas registradas</span>
        </div>

        <div>
          <strong>{syncedSessions.length}</strong>
          <span>Sincronizadas</span>
        </div>

        <div>
          <strong>{unsyncedSessions.length}</strong>
          <span>Pendentes</span>
        </div>
      </div>

      <div className="admin-actions">
        <button
          className="primary-button"
          onClick={handleExportSessions}
          disabled={sessions.length === 0}
        >
          Exportar sessões
        </button>

        <button
          className="primary-button"
          onClick={handleExportAnswers}
          disabled={sessions.length === 0}
        >
          Exportar respostas
        </button>

        <button
          className="primary-button"
          onClick={handleExportRanking}
          disabled={sessions.length === 0}
        >
          Exportar ranking
        </button>

        <button
          className="primary-button"
          onClick={handleSyncPendingSessions}
          disabled={unsyncedSessions.length === 0}
        >
          Sincronizar pendentes
        </button>

        <button className="secondary-button" onClick={refreshSessions}>
          Atualizar dados
        </button>

        <button className="danger-button" onClick={handleClearSessions}>
          Limpar dados locais
        </button>

        <button className="secondary-button" onClick={onBack}>
          Voltar
        </button>
      </div>
    </section>
  );
}

export default AdminExport;
