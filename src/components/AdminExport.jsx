import { useEffect, useMemo, useState } from "react";
import {
  clearLocalSessions,
  getKioskId,
  getLocalSessions,
  setKioskId,
} from "../services/storage";
import { syncPendingSessions } from "../services/analytics";
import {
  exportAnswersCSV,
  exportRankingCSV,
  exportSessionsCSV,
} from "../utils/csv";

function AdminExport({ onBack }) {
  const [sessions, setSessions] = useState(() => getLocalSessions());
  const [currentKioskId, setCurrentKioskId] = useState(() => getKioskId());
  const [kioskInput, setKioskInput] = useState(() => getKioskId());
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(document.fullscreenElement),
  );

  const stats = useMemo(() => {
    const completedSessions = sessions.filter((session) => session.completed);
    const syncedSessions = sessions.filter((session) => session.synced);
    const pendingSessions = sessions.filter((session) => !session.synced);

    const totalAnswers = sessions.reduce((total, session) => {
      return total + (session.answers?.length || 0);
    }, 0);

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalAnswers,
      syncedSessions: syncedSessions.length,
      pendingSessions: pendingSessions.length,
    };
  }, [sessions]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  function refreshSessions() {
    setSessions(getLocalSessions());
    setCurrentKioskId(getKioskId());
    setKioskInput(getKioskId());
  }

  function handleSaveKioskId(event) {
    event.preventDefault();

    const savedKioskId = setKioskId(kioskInput);

    setCurrentKioskId(savedKioskId);
    setKioskInput(savedKioskId);
  }

  async function handleSyncPendingSessions() {
    await syncPendingSessions();
    refreshSessions();
  }

  function handleClearLocalSessions() {
    const shouldClear = window.confirm(
      "Tem certeza que deseja apagar os dados locais deste navegador?",
    );

    if (!shouldClear) return;

    clearLocalSessions();
    refreshSessions();
  }

  async function handleToggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch (error) {
      console.error("Erro ao alternar tela cheia:", error);
      alert(
        "Não foi possível ativar a tela cheia. Tente novamente pelo navegador do totem.",
      );
    }
  }

  return (
    <section className="screen admin-screen">
      <div className="admin-header">
        <div>
          <p className="admin-label">FORJA Match</p>
          <h1>Admin</h1>
        </div>

        <button
          className="secondary-button admin-small-button"
          onClick={onBack}
        >
          Voltar
        </button>
      </div>

      <section className="admin-panel">
        <h2>Configuração do totem</h2>

        <form className="kiosk-form" onSubmit={handleSaveKioskId}>
          <label htmlFor="kioskId">Nome do totem atual</label>

          <div className="kiosk-input-row">
            <input
              id="kioskId"
              type="text"
              value={kioskInput}
              onChange={(event) => setKioskInput(event.target.value)}
              placeholder="Ex.: totem_01"
            />

            <button
              className="secondary-button admin-small-button"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>

        <p className="admin-help">
          Totem atual: <strong>{currentKioskId}</strong>. As próximas sessões
          serão registradas com esse identificador.
        </p>

        <button
          className="secondary-button admin-small-button"
          onClick={handleToggleFullscreen}
        >
          {isFullscreen ? "⛶ Sair da tela cheia" : "⛶ Ativar tela cheia"}
        </button>
      </section>

      <section className="admin-stats">
        <div>
          <strong>{stats.totalSessions}</strong>
          <span>Sessões locais</span>
        </div>

        <div>
          <strong>{stats.completedSessions}</strong>
          <span>Concluídas</span>
        </div>

        <div>
          <strong>{stats.totalAnswers}</strong>
          <span>Respostas</span>
        </div>

        <div>
          <strong>{stats.syncedSessions}</strong>
          <span>Sincronizadas</span>
        </div>

        <div>
          <strong>{stats.pendingSessions}</strong>
          <span>Pendentes</span>
        </div>
      </section>

      <section className="admin-actions">
        <button
          className="secondary-button admin-small-button"
          onClick={() => exportSessionsCSV(sessions)}
          disabled={sessions.length === 0}
        >
          Exportar sessões
        </button>

        <button
          className="secondary-button admin-small-button"
          onClick={() => exportAnswersCSV(sessions)}
          disabled={sessions.length === 0}
        >
          Exportar respostas
        </button>

        <button
          className="secondary-button admin-small-button"
          onClick={() => exportRankingCSV(sessions)}
          disabled={sessions.length === 0}
        >
          Exportar ranking
        </button>

        <button
          className="secondary-button admin-small-button"
          onClick={handleSyncPendingSessions}
          disabled={stats.pendingSessions === 0}
        >
          Sincronizar pendentes
        </button>

        <button
          className="secondary-button admin-small-button"
          onClick={refreshSessions}
        >
          Atualizar dados
        </button>

        <button
          className="danger-button admin-small-button"
          onClick={handleClearLocalSessions}
          disabled={sessions.length === 0}
        >
          Limpar dados locais
        </button>
      </section>
    </section>
  );
}

export default AdminExport;
