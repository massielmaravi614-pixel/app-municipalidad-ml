from database import *
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Tramite(BaseModel):
    nombre: str
    dni: str
    tipo_tramite: str
    documentos: int
    dias_espera: int


def calcular_prioridad(documentos: int, dias_espera: int):

    if dias_espera > 7 and documentos > 5:
        return "Alta"

    if dias_espera <= 3:
        return "Baja"

    return "Media"

crear_bd()

@app.get("/")
def inicio():
    return {
        "mensaje": "Conexión exitosa con FastAPI"
    }

@app.get("/predecir")
def predecir(documentos: int, dias_espera: int):

    prioridad = calcular_prioridad(documentos, dias_espera)

    return {
        "prioridad": prioridad
    }

@app.post("/registrar")
def registrar(tramite: Tramite):

    prioridad = calcular_prioridad(tramite.documentos, tramite.dias_espera)

    guardar_tramite(
        tramite.nombre,
        tramite.dni,
        tramite.tipo_tramite,
        tramite.documentos,
        tramite.dias_espera,
        prioridad
    )

    return {
        "mensaje": "Trámite registrado",
        "prioridad": prioridad
    }


@app.put("/tramites/{id_tramite}")
def editar_tramite(id_tramite: int, tramite: Tramite):

    prioridad = calcular_prioridad(tramite.documentos, tramite.dias_espera)

    actualizar_tramite(
        id_tramite,
        tramite.nombre,
        tramite.dni,
        tramite.tipo_tramite,
        tramite.documentos,
        tramite.dias_espera,
        prioridad
    )

    return {
        "mensaje": "Trámite actualizado",
        "prioridad": prioridad
    }


@app.delete("/tramites/{id_tramite}")
def borrar_tramite(id_tramite: int):

    eliminar_tramite(id_tramite)

    return {
        "mensaje": "Trámite eliminado"
    }

@app.get("/tramites")
def listar_tramites():

    datos = obtener_tramites()

    return {
        "tramites": datos
    }