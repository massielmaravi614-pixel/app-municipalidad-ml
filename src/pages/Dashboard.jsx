import { useEffect, useMemo, useState } from "react";
import { fetchTramites } from "../services/api";
import GraficoPrioridades from "../components/GraficoPrioridades";

function Dashboard() {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();

    const refrescar = () => {
      cargarDatos();
    };

    window.addEventListener("tramites-actualizados", refrescar);

    return () => {
      window.removeEventListener("tramites-actualizados", refrescar);
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const datos = await fetchTramites();
      setTramites(datos);
    } catch (error) {
      console.error(error);
      setError(error.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const resumen = useMemo(() => {
    const total = tramites.length;
    const altas = tramites.filter((t) => t.prioridad === "Alta").length;
    const medias = tramites.filter((t) => t.prioridad === "Media").length;
    const bajas = tramites.filter((t) => t.prioridad === "Baja").length;

    return { total, altas, medias, bajas };
  }, [tramites]);

  const { total, altas, medias, bajas } = resumen;

  let recomendacion = "El flujo de trámites es equilibrado.";

  if (altas > medias && altas > bajas) {
    recomendacion =
      "Se recomienda asignar más recursos a los trámites de prioridad alta.";
  }

  return (
    <div className="page-shell">
      <div className="page-header card">
        <div>
          <p className="eyebrow">Municipalidad</p>
          <h1>Dashboard municipal</h1>
          <p className="muted">Seguimiento dinámico de los trámites registrados y su priorización simulada.</p>
        </div>
      </div>

      {loading && total === 0 ? (
        <div className="card state-card">
          <div className="spinner" />
          <p>Cargando métricas bonitas...</p>
        </div>
      ) : null}

      {error ? (
        <div className="card state-card state-error">
          <h2>No pudimos cargar la información 🌸</h2>
          <p>{error}</p>
        </div>
      ) : null}

      {!loading && !error && total === 0 ? (
        <div className="card state-card empty-state-card">
          <h2>No hay trámites aún 🌸</h2>
          <p>Cuando registres trámites, aquí verás las métricas y la distribución de prioridades.</p>
        </div>
      ) : null}

      {!error ? (
        <>
          <div className="stats-grid fade-in-up">
        <div className="card stat-card">
          <span className="stat-label">Total trámites</span>
              <strong className="stat-value">{loading ? "—" : total}</strong>
        </div>

        <div className="card stat-card stat-high">
          <span className="stat-label">Prioridad alta</span>
              <strong className="stat-value">{loading ? "—" : altas}</strong>
        </div>

        <div className="card stat-card stat-medium">
          <span className="stat-label">Prioridad media</span>
              <strong className="stat-value">{loading ? "—" : medias}</strong>
        </div>

        <div className="card stat-card stat-low">
          <span className="stat-label">Prioridad baja</span>
              <strong className="stat-value">{loading ? "—" : bajas}</strong>
        </div>
      </div>

          <div className="card content-card fade-in-up">
            <h2>Distribución de prioridades</h2>

            {loading && total === 0 ? (
              <div className="chart-placeholder">Preparando gráfico...</div>
            ) : (
              <GraficoPrioridades altas={altas} medias={medias} bajas={bajas} />
            )}
          </div>

          <div className="card content-card fade-in-up">
            <h2>Recomendación del sistema</h2>
            <p>{recomendacion}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;