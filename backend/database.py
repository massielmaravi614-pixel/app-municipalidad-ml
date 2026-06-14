import sqlite3

def crear_bd():

    conexion = sqlite3.connect("tramites.db")

    cursor = conexion.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tramites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        dni TEXT,
        tipo_tramite TEXT,
        documentos INTEGER,
        dias_espera INTEGER,
        prioridad TEXT
    )
    """)

    conexion.commit()
    conexion.close()


def guardar_tramite(
    nombre,
    dni,
    tipo_tramite,
    documentos,
    dias_espera,
    prioridad
):

    conexion = sqlite3.connect("tramites.db")

    cursor = conexion.cursor()

    cursor.execute("""
    INSERT INTO tramites
    (
        nombre,
        dni,
        tipo_tramite,
        documentos,
        dias_espera,
        prioridad
    )
    VALUES (?, ?, ?, ?, ?, ?)
    """,
    (
        nombre,
        dni,
        tipo_tramite,
        documentos,
        dias_espera,
        prioridad
    ))

    conexion.commit()
    conexion.close()


def actualizar_tramite(
    id_tramite,
    nombre,
    dni,
    tipo_tramite,
    documentos,
    dias_espera,
    prioridad
):

    conexion = sqlite3.connect("tramites.db")

    cursor = conexion.cursor()

    cursor.execute("""
    UPDATE tramites
    SET nombre = ?, dni = ?, tipo_tramite = ?, documentos = ?, dias_espera = ?, prioridad = ?
    WHERE id = ?
    """,
    (
        nombre,
        dni,
        tipo_tramite,
        documentos,
        dias_espera,
        prioridad,
        id_tramite
    ))

    conexion.commit()
    conexion.close()


def eliminar_tramite(id_tramite):

    conexion = sqlite3.connect("tramites.db")

    cursor = conexion.cursor()

    cursor.execute("""
    DELETE FROM tramites
    WHERE id = ?
    """, (id_tramite,))

    conexion.commit()
    conexion.close()


def obtener_tramites():

    conexion = sqlite3.connect("tramites.db")

    cursor = conexion.cursor()

    cursor.execute("""
    SELECT * FROM tramites
    ORDER BY id DESC
    """)

    datos = cursor.fetchall()

    conexion.close()

    return datos