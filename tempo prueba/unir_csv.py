import pandas as pd
import glob
import os

# Carpeta donde están los CSV generados
carpeta = "./"  # Cambiar si es necesario

# Número de decimales para agrupar coordenadas
DECIMALES = 1

# Buscar los CSV unificados
csv_archivos = glob.glob(os.path.join(carpeta, "*_unido.csv"))

if len(csv_archivos) != 2:
    print("Se esperaban exactamente 2 CSV unificados. Encontrados:", len(csv_archivos))
else:
    # Leer ambos CSV
    df1 = pd.read_csv(csv_archivos[0])
    df2 = pd.read_csv(csv_archivos[1])

    # Redondear latitud y longitud
    df1['latitud'] = df1['latitud'].round(DECIMALES)
    df1['longitud'] = df1['longitud'].round(DECIMALES)
    df2['latitud'] = df2['latitud'].round(DECIMALES)
    df2['longitud'] = df2['longitud'].round(DECIMALES)

    # Eliminar posibles duplicados tras redondear
    df1 = df1.drop_duplicates(subset=['latitud', 'longitud'])
    df2 = df2.drop_duplicates(subset=['latitud', 'longitud'])

    # Renombrar columnas 'valor' para identificar de qué archivo viene
    nombre1 = os.path.splitext(os.path.basename(csv_archivos[0]))[0]
    nombre2 = os.path.splitext(os.path.basename(csv_archivos[1]))[0]
    df1 = df1.rename(columns={'valor': f'valor_{nombre1}'})
    df2 = df2.rename(columns={'valor': f'valor_{nombre2}'})

    # Outer join para incluir todas las coordenadas
    df_merged = pd.merge(df1, df2, on=['latitud', 'longitud'], how='outer')

    # Ordenar por latitud y longitud
    df_merged = df_merged.sort_values(by=['latitud', 'longitud']).reset_index(drop=True)

    # Guardar CSV final
    salida = os.path.join(carpeta, "csv_combinado.csv")
    df_merged.to_csv(salida, index=False)
    print(f"CSV combinado guardado como '{salida}'")
