# script para crear un dataset combinando archivos CSV
import pandas as pd
import os

# Define las columnas de entrada y salida
input_columns = ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene']
output_column = 'AQI'

# Define la carpeta donde están los archivos CSV
csv_folder = 'p3'

# Lista para almacenar los DataFrames de cada archivo CSV
dataframes = []

# Itera sobre los archivos en la carpeta
for filename in os.listdir(csv_folder):
    if filename.endswith('.csv') and filename != 'stations.csv':
        filepath = os.path.join(csv_folder, filename)
        try:
            # Lee el archivo CSV
            df = pd.read_csv(filepath)

            # Selecciona solo las columnas de entrada y salida
            df = df[input_columns + [output_column]]

            # Elimina las filas que tengan valores vacíos en las columnas de entrada o salida
            df = df.dropna(subset=input_columns + [output_column])

            # Agrega el DataFrame a la lista
            dataframes.append(df)
        except Exception as e:
            print(f"Error al leer o procesar el archivo {filename}: {e}")

# Concatena todos los DataFrames en uno solo
if dataframes:
    final_df = pd.concat(dataframes, ignore_index=True)

    # Guarda el DataFrame final en un nuevo archivo CSV
    final_df.to_csv(os.path.join(csv_folder, 'dataset.csv'), index=False)

    print("Dataset final creado exitosamente en p3/dataset.csv")
else:
    print("No se encontraron archivos CSV para procesar.")