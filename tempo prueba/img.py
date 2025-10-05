import rasterio
import matplotlib.pyplot as plt
import numpy as np

ruta = "TEMPO_O3TOT_L3_V04_unido.tif"

# Abrimos el GeoTIFF
with rasterio.open(ruta) as src:
    datos = src.read(1)  # Primera banda
    nodata = src.nodata
    transform = src.transform

# Reemplazamos NoData por NaN
datos = np.where(datos == nodata, np.nan, datos)

# Visualizar usando imshow con transformada
plt.figure(figsize=(12, 6))
# extent = (x_min, x_max, y_min, y_max)
extent = (transform[2], transform[2] + transform[0]*datos.shape[1],
          transform[5] + transform[4]*datos.shape[0], transform[5])

plt.imshow(datos, cmap='viridis', extent=extent, origin='upper')
plt.colorbar(label='Valor')
plt.title('GeoTIFF con coordenadas reales')
plt.xlabel('Coordenada X')
plt.ylabel('Coordenada Y')
plt.show()
