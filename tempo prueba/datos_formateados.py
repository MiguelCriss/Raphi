import rasterio
import numpy as np
import pandas as pd

ruta = "TEMPO_NO2_L2_V04_20251004T121727Z_S002G02.tif"

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

# Guardar CSV
df.to_csv("datos_tif_latlon.csv", index=False)
print("Archivo CSV guardado como 'datos_tif_latlon.csv'")
