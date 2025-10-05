import rasterio
import numpy as np
import pandas as pd
import glob
import os

# Carpeta donde están los TIF unificados
carpeta = "./"  # Cambiar si es necesario

# Buscar todos los TIF unificados
tif_unificados = glob.glob(os.path.join(carpeta, "*_unido.tif"))

for ruta in tif_unificados:
    # Abrir GeoTIFF
    with rasterio.open(ruta) as src:
        datos = src.read(1)  # Primera banda
        transform = src.transform
        nodata = src.nodata

    # Reemplazar NoData por NaN
    datos = np.where(datos == nodata, np.nan, datos)

    # Crear listas para lat, lon y valor
    rows, cols = np.indices(datos.shape)
    lons, lats = rasterio.transform.xy(transform, rows, cols, offset='center')

    # Convertir a arrays 1D
    lats = np.array(lats).flatten()
    lons = np.array(lons).flatten()
    valores = datos.flatten()

    # Crear DataFrame y eliminar filas donde valor es NaN
    df = pd.DataFrame({
        'latitud': lats,
        'longitud': lons,
        'valor': valores
    })
    df = df[np.isfinite(df['valor'])]

    # Guardar CSV con el mismo nombre que el TIFF
    nombre_csv = os.path.splitext(os.path.basename(ruta))[0] + ".csv"
    df.to_csv(nombre_csv, index=False)
    print(f"Archivo CSV guardado como '{nombre_csv}'")
