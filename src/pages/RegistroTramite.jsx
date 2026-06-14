import { useEffect, useState } from "react";
import { calcularPrioridad, registrarTramite } from "../services/api";

function RegistroTramite() {

  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [tipoTramite, setTipoTramite] = useState("");
  const [documentos, setDocumentos] = useState("");
  const [dias, setDias] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mensaje && !error) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMensaje("");
      setError("");
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [mensaje, error]);

  const handleRegistrarTramite = async () => {

    const documentosNumero = Number(documentos);
    const diasNumero = Number(dias);
    const prioridadCalculada = calcularPrioridad({
      documentos: documentosNumero,
      dias_espera: diasNumero
    });

    try {
      await registrarTramite({
        nombre: nombre,
        dni: dni,
        tipo_tramite: tipoTramite,
        documentos: documentosNumero,
        dias_espera: diasNumero
      });

      setPrioridad(prioridadCalculada);
      setMensaje("Trámite registrado correctamente");
      setError("");
      setNombre("");
      setDni("");
      setTipoTramite("");
      setDocumentos("");
      setDias("");
      window.dispatchEvent(new Event("tramites-actualizados"));

    } catch (error) {

      console.error(error);
      setError("Error al registrar trámite");
      setMensaje("");

    }

  };

  return (
    <div className="page-shell">
      <div className="page-header card">
        <div>
          <p className="eyebrow">Sistema de gestión documental</p>
          <h1>Registro de trámite</h1>
          <p className="muted">Simulación de priorización inteligente para atención municipal.</p>
        </div>
      </div>

      <div className="card form-card fade-in-up">
        <div className="form-grid">
          <label>
            <span>Nombre</span>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          <label>
            <span>DNI</span>
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </label>

          <label>
            <span>Tipo de trámite</span>
            <input
              type="text"
              placeholder="Tipo de trámite"
              value={tipoTramite}
              onChange={(e) => setTipoTramite(e.target.value)}
            />
          </label>

          <label>
            <span>Cantidad de documentos</span>
            <input
              type="number"
              placeholder="Cantidad de documentos"
              value={documentos}
              onChange={(e) => setDocumentos(e.target.value)}
            />
          </label>

          <label>
            <span>Días de espera</span>
            <input
              type="number"
              placeholder="Días de espera"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" onClick={handleRegistrarTramite}>
            Registrar trámite
          </button>
        </div>

        <div className="status-stack">
          {mensaje ? <div className="toast toast-success">{mensaje}</div> : null}
          {error ? <div className="toast toast-error">{error}</div> : null}
          {prioridad ? (
            <div className={`priority-badge priority-${prioridad.toLowerCase()}`}>
              Prioridad asignada: {prioridad}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default RegistroTramite;