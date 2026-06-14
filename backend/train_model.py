import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib

datos = pd.read_csv("tramites.csv")

X = datos[["documentos", "dias_espera"]]
y = datos["prioridad"]

modelo = DecisionTreeClassifier()

modelo.fit(X, y)

joblib.dump(modelo, "modelo.pkl")

print("Modelo entrenado correctamente")