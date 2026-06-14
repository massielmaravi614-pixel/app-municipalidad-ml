import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

const extraerMensajeError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  return error.message || "No se pudo completar la solicitud.";
};

export const calcularPrioridad = ({ documentos, dias_espera }) => {
  if (dias_espera > 7 && documentos > 5) {
    return "Alta";
  }

  if (dias_espera <= 3) {
    return "Baja";
  }

  return "Media";
};

export const mapTramite = (tramite) => ({
  id: tramite[0],
  nombre: tramite[1],
  dni: tramite[2],
  tipo_tramite: tramite[3],
  documentos: tramite[4],
  dias_espera: tramite[5],
  prioridad: tramite[6]
});

export const fetchTramites = async () => {
  try {
    const respuesta = await api.get("/tramites");
    const tramites = respuesta.data?.tramites;

    if (!Array.isArray(tramites)) {
      throw new Error("La respuesta del servidor no tiene el formato esperado.");
    }

    return tramites.map(mapTramite);
  } catch (error) {
    throw new Error(extraerMensajeError(error));
  }
};

export const registrarTramite = async (payload) => {
  try {
    const respuesta = await api.post("/registrar", payload);
    return respuesta.data;
  } catch (error) {
    throw new Error(extraerMensajeError(error));
  }
};

export const actualizarTramite = async (id, payload) => {
  try {
    const respuesta = await api.put(`/tramites/${id}`, payload);
    return respuesta.data;
  } catch (error) {
    throw new Error(extraerMensajeError(error));
  }
};

export const eliminarTramite = async (id) => {
  try {
    const respuesta = await api.delete(`/tramites/${id}`);
    return respuesta.data;
  } catch (error) {
    throw new Error(extraerMensajeError(error));
  }
};

export default api;