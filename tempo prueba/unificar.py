import rasterio
from rasterio.merge import merge
import glob
import os

# Carpeta donde están tus archivos .tif
carpeta = "./"  # Cambiar por tu ruta si no es la actual

# Prefijos de los grupos
grupos = {
    "TEMPO_NO2_L2_V04": [],
    "TEMPO_O3TOT_L3_V04": []
}

# Buscar todos los archivos .tif
archivos_tif = glob.glob(os.path.join(carpeta, "*.tif"))

# Agrupar archivos según el prefijo
for archivo in archivos_tif:
    nombre = os.path.basename(archivo)
    for prefijo in grupos.keys():
        if nombre.startswith(prefijo):
            grupos[prefijo].append(archivo)

# Unificar y guardar un TIFF por grupo
for prefijo, lista_archivos in grupos.items():
    if not lista_archivos:
        print(f"No se encontraron archivos para el grupo {prefijo}")
        continue

    # Abrir todos los archivos del grupo
    src_files_to_mosaic = []
    for fp in lista_archivos:
        src = rasterio.open(fp)
        src_files_to_mosaic.append(src)

    # Unir
    mosaic, out_trans = merge(src_files_to_mosaic)

    # Copiar metadatos del primer archivo y actualizar
    out_meta = src_files_to_mosaic[0].meta.copy()
    out_meta.update({
        "driver": "GTiff",
        "height": mosaic.shape[1],
        "width": mosaic.shape[2],
        "transform": out_trans
    })

    # Guardar el TIFF unido
    salida = os.path.join(carpeta, f"{prefijo}_unido.tif")
    with rasterio.open(salida, "w", **out_meta) as dest:
        dest.write(mosaic)

    print(f"Archivo unido guardado: {salida}")

    # Cerrar archivos abiertos
    for src in src_files_to_mosaic:
        src.close()
