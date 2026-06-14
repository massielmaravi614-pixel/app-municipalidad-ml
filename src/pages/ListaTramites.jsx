import { useEffect, useMemo, useState } from "react";
import { actualizarTramite, eliminarTramite, fetchTramites } from "../services/api";

function ListaTramites() {

  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");
  const [tramiteEditando, setTramiteEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: "",
    dni: "",
    tipo_tramite: "",
    documentos: "",
    dias_espera: ""
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarTramites();

    const refrescar = () => {
      cargarTramites();
    };

    window.addEventListener("tramites-actualizados", refrescar);

    return () => {
      window.removeEventListener("tramites-actualizados", refrescar);
    };
  }, []);

  const cargarTramites = async () => {
    setLoading(true);
    setError("");

    try {

      const datos = await fetchTramites();

      setTramites(datos);

    } catch (error) {

      console.error(error);
      setError(error.message || "No se pudieron cargar los trámites.");

    } finally {
      setLoading(false);
    }

  };

  const tramitesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return [...tramites]
      .filter((tramite) => {
        const coincideBusqueda =
          termino === "" ||
          tramite.nombre.toLowerCase().includes(termino) ||
          tramite.dni.toLowerCase().includes(termino);

        const coincidePrioridad =
          filtroPrioridad === "Todas" || tramite.prioridad === filtroPrioridad;

        return coincideBusqueda && coincidePrioridad;
      })
      .sort((a, b) => b.id - a.id);
  }, [tramites, busqueda, filtroPrioridad]);

  const iniciarEdicion = (tramite) => {
    setTramiteEditando(tramite.id);
    setFormulario({
      nombre: tramite.nombre,
      dni: tramite.dni,
      tipo_tramite: tramite.tipo_tramite,
      documentos: String(tramite.documentos),
      dias_espera: String(tramite.dias_espera)
    });
    setMensaje("");
    setError("");
  };

  const cancelarEdicion = () => {
    setTramiteEditando(null);
    setFormulario({
      nombre: "",
      dni: "",
      tipo_tramite: "",
      documentos: "",
      dias_espera: ""
    });
  };

  const guardarEdicion = async () => {
    try {
      const payload = {
        nombre: formulario.nombre,
        dni: formulario.dni,
        tipo_tramite: formulario.tipo_tramite,
        documentos: Number(formulario.documentos),
        dias_espera: Number(formulario.dias_espera)
      };

      const respuesta = await actualizarTramite(tramiteEditando, payload);

      setMensaje(`Trámite actualizado correctamente. Prioridad: ${respuesta.prioridad}`);
      setError("");
      cancelarEdicion();
      await cargarTramites();
      window.dispatchEvent(new Event("tramites-actualizados"));
    } catch (error) {
      console.error(error);
      setError("No fue posible actualizar el trámite");
      setMensaje("");
    }
  };

  const borrar = async (tramite) => {
    const confirmar = window.confirm(
      `¿Eliminar el trámite de ${tramite.nombre}? Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarTramite(tramite.id);
      setMensaje("Trámite eliminado correctamente");
      setError("");
      await cargarTramites();
      window.dispatchEvent(new Event("tramites-actualizados"));
    } catch (error) {
      console.error(error);
      setError("No fue posible eliminar el trámite");
      setMensaje("");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header card">
        <div>
          <p className="eyebrow">Gestión operativa</p>
          <h1>Lista de trámites</h1>
          <p className="muted">Busca, filtra, edita y elimina trámites sin perder la lógica existente.</p>
        </div>
      </div>

      <div className="card toolbar-card">
        <div className="toolbar-grid">
          <label>
            <span>Buscar por nombre o DNI</span>
            <input
              type="text"
              placeholder="Ej. Juan o 12345678"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>

          <label>
            <span>Filtrar por prioridad</span>
            <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
              <option>Todas</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
        </div>

        {mensaje ? <div className="notice success">{mensaje}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}
      </div>

      {loading && tramites.length === 0 ? (
        <div className="card state-card">
          <div className="spinner" />
          <p>Cargando trámites...</p>
        </div>
      ) : null}

      {tramiteEditando ? (
        <div className="card edit-card fade-in-up">
          <h2>Editar trámite</h2>
          <div className="form-grid compact-grid">
            <label>
              <span>Nombre</span>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              />
            </label>

            <label>
              <span>DNI</span>
              <input
                type="text"
                value={formulario.dni}
                onChange={(e) => setFormulario({ ...formulario, dni: e.target.value })}
              />
            </label>

            <label>
              <span>Tipo de trámite</span>
              <input
                type="text"
                value={formulario.tipo_tramite}
                onChange={(e) => setFormulario({ ...formulario, tipo_tramite: e.target.value })}
              />
            </label>

            <label>
              <span>Documentos</span>
              <input
                type="number"
                value={formulario.documentos}
                onChange={(e) => setFormulario({ ...formulario, documentos: e.target.value })}
              />
            </label>

            <label>
              <span>Días de espera</span>
              <input
                type="number"
                value={formulario.dias_espera}
                onChange={(e) => setFormulario({ ...formulario, dias_espera: e.target.value })}
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary-button" onClick={guardarEdicion}>Guardar cambios</button>
            <button className="secondary-button" onClick={cancelarEdicion}>Cancelar</button>
          </div>
        </div>
      ) : null}

      {!loading && !error && tramitesFiltrados.length === 0 ? (
        <div className="card state-card empty-state-card">
          <h2>No hay trámites aún 🌸</h2>
          <p>{busqueda || filtroPrioridad !== "Todas" ? "Prueba cambiando el filtro o búsqueda." : "Agrega el primer trámite para comenzar."}</p>
        </div>
      ) : null}

      {!error ? (
      <div className="card table-card fade-in-up">
        <div className="table-wrap">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Trámite</th>
                <th>Documentos</th>
                <th>Días</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tramitesFiltrados.length > 0 ? (
                tramitesFiltrados.map((tramite) => (
                  <tr key={tramite.id}>
                    <td>{tramite.id}</td>
                    <td>{tramite.nombre}</td>
                    <td>{tramite.dni}</td>
                    <td>{tramite.tipo_tramite}</td>
                    <td>{tramite.documentos}</td>
                    <td>{tramite.dias_espera}</td>
                    <td>
                      <span className={`priority-badge priority-${tramite.prioridad.toLowerCase()}`}>
                        {tramite.prioridad}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="ghost-button" onClick={() => iniciarEdicion(tramite)}>Editar</button>
                        <button className="danger-button" onClick={() => borrar(tramite)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No hay trámites que coincidan con la búsqueda o el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : null}
    </div>
  );
}

export default ListaTramites;