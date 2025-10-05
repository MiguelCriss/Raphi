from machine import ADC, Pin
import time
import math

# Configurar ADC para los 3 sensores MQ
mq131 = ADC(26)  # Sensor de O3/NO2
mq135 = ADC(27)  # Sensor de NO2/CO/Calidad Aire  
mq138 = ADC(28)  # Sensor de HCHO/VOC

# Valores base en aire limpio (calibrar según entorno)
BASE_MQ131 = 1.8
BASE_MQ135 = 1.6  
BASE_MQ138 = 1.7

# Estados de simulación
simulacion_activa = True
gas_actual = "AIRE_LIMPIO"

# NIVELES DE CALIDAD DEL AIRE SEGÚN ESTÁNDARES INTERNACIONALES
NIVELES_CALIDAD_AIRE = {
    'EXCELENTE': {'O3': 0.02, 'NO2': 0.02, 'HCHO': 0.01, 'ICA': 0, 'simbolo': '[E]'},
    'BUENA': {'O3': 0.05, 'NO2': 0.04, 'HCHO': 0.03, 'ICA': 1, 'simbolo': '[B]'},
    'MODERADA': {'O3': 0.08, 'NO2': 0.06, 'HCHO': 0.05, 'ICA': 2, 'simbolo': '[M]'},
    'CONTAMINADA': {'O3': 0.12, 'NO2': 0.10, 'HCHO': 0.08, 'ICA': 3, 'simbolo': '[C]'},
    'PELIGROSA': {'O3': 0.15, 'NO2': 0.15, 'HCHO': 0.12, 'ICA': 4, 'simbolo': '[P]'}
}

def simular_gas():
    """Simula diferentes escenarios de gases con niveles realistas"""
    global gas_actual
    
    tiempo_actual = time.time() % 80  # Ciclo de 80 segundos
    
    if tiempo_actual < 20:
        return "AIRE_LIMPIO", 0.0, 0.0, 0.0
    elif tiempo_actual < 35:
        return "O3", 0.6, 0.1, 0.05  # O3 puro
    elif tiempo_actual < 50:
        return "NO2", 0.3, 0.8, 0.2   # NO2 predominante
    elif tiempo_actual < 65:
        return "HCHO", 0.1, 0.3, 0.9  # HCHO predominante
    else:
        return "MIXTO", 0.4, 0.5, 0.4  # Mezcla de gases

def leer_sensores_simulados():
    """Lee sensores reales o simula lecturas"""
    global gas_actual
    
    if simulacion_activa:
        gas, factor131, factor135, factor138 = simular_gas()
        gas_actual = gas
        
        # Simular lecturas más realistas
        v131 = max(0.8, BASE_MQ131 - (factor131 * 0.8))
        v135 = max(0.8, BASE_MQ135 - (factor135 * 0.7))
        v138 = max(0.8, BASE_MQ138 - (factor138 * 0.7))
        
        # Ruido simulado más realista
        ruido = (time.time() % 0.2) * 0.05
        v131 += ruido
        v135 += ruido * 1.2
        v138 += ruido * 0.8
        
    else:
        # Lecturas reales de ADC
        v131 = mq131.read_u16() * 3.3 / 65535
        v135 = mq135.read_u16() * 3.3 / 65535
        v138 = mq138.read_u16() * 3.3 / 65535
    
    # Normalizar lecturas (0-1 donde 1 = máxima concentración)
    n131 = max(0, (BASE_MQ131 - v131) / BASE_MQ131)
    n135 = max(0, (BASE_MQ135 - v135) / BASE_MQ135)
    n138 = max(0, (BASE_MQ138 - v138) / BASE_MQ138)
    
    return n131, n135, n138, v131, v135, v138

def determinar_calidad_aire(concentraciones):
    """Determina la calidad del aire basado en las concentraciones"""
    o3, no2, hcho = concentraciones
    
    # Encontrar el peor contaminante
    nivel_o3 = 0
    nivel_no2 = 0
    nivel_hcho = 0
    
    # Determinar nivel para cada gas
    for nivel, limites in NIVELES_CALIDAD_AIRE.items():
        if o3 <= limites['O3']:
            nivel_o3 = limites['ICA']
        if no2 <= limites['NO2']:
            nivel_no2 = limites['ICA'] 
        if hcho <= limites['HCHO']:
            nivel_hcho = limites['ICA']
    
    # El nivel general es el peor de los tres
    nivel_general = max(nivel_o3, nivel_no2, nivel_hcho)
    
    # Encontrar nombre del nivel
    for nombre, datos in NIVELES_CALIDAD_AIRE.items():
        if datos['ICA'] == nivel_general:
            return nombre, datos['simbolo'], nivel_general
    
    return 'EXCELENTE', '[E]', 0

def discriminar_gases(umbral=0.08):
    """Algoritmo mejorado de discriminación con 3 sensores"""
    n131, n135, n138, v131, v135, v138 = leer_sensores_simulados()
    
    # Calcular concentraciones estimadas (ppm)
    conc_O3 = n131 * 0.2   # Escalar a ppm realista
    conc_NO2 = n135 * 0.3
    conc_HCHO = n138 * 0.15
    
    # Determinar calidad del aire
    calidad_aire, simbolo, ica = determinar_calidad_aire((conc_O3, conc_NO2, conc_HCHO))
    
    # Ratios para discriminación
    ratio_131_135 = n131 / (n135 + 0.001)
    ratio_131_138 = n131 / (n138 + 0.001)
    ratio_135_138 = n135 / (n138 + 0.001)
    
    resultado = {
        'O3': False, 'NO2': False, 'HCHO': False,
        'concentracion_O3': conc_O3,
        'concentracion_NO2': conc_NO2, 
        'concentracion_HCHO': conc_HCHO,
        'calidad_aire': calidad_aire,
        'simbolo_aire': simbolo,
        'ica_nivel': ica,
        'gas_simulado': gas_actual
    }
    
    # ALGORITMO MEJORADO DE DISCRIMINACIÓN
    activos = sum([n131 > umbral, n135 > umbral, n138 > umbral])
    
    if activos == 0:
        # Todos los sensores en niveles bajos
        resultado['calidad_aire'] = 'EXCELENTE'
        resultado['simbolo_aire'] = '[E]'
        
    elif activos == 1:
        # Solo un sensor activo
        if n131 > umbral and n135 < umbral * 0.6 and n138 < umbral * 0.6:
            resultado['O3'] = True
        elif n135 > umbral and n131 < umbral * 0.7:
            resultado['NO2'] = True  
        elif n138 > umbral and n131 < umbral * 0.5:
            resultado['HCHO'] = True
            
    elif activos >= 2:
        # Múltiples sensores activos - análisis de patrones
        if ratio_131_135 > 2.0 and n138 < umbral * 0.8:
            # MQ131 mucho más alto que MQ135 -> O3 predominante
            resultado['O3'] = True
            if n135 > umbral * 0.7:
                resultado['NO2'] = True  # Con algo de NO2
                
        elif ratio_135_138 > 1.5 and n131 > umbral * 0.6:
            # MQ135 alto con MQ131 moderado -> NO2 con O3
            resultado['NO2'] = True
            resultado['O3'] = True
            
        elif n138 > umbral * 1.2 and ratio_131_138 < 0.8:
            # MQ138 muy alto -> HCHO predominante
            resultado['HCHO'] = True
            if n135 > umbral:
                resultado['NO2'] = True
                
        else:
            # Mezcla compleja - activar todas las detecciones relevantes
            if n131 > umbral * 0.8:
                resultado['O3'] = True
            if n135 > umbral * 0.8:
                resultado['NO2'] = True
            if n138 > umbral * 0.8:
                resultado['HCHO'] = True
    
    return resultado, ratio_131_135, ratio_131_138, v131, v135, v138

def mostrar_estado_sensores():
    """Muestra representación visual mejorada del estado de sensores"""
    n131, n135, n138, v131, v135, v138 = leer_sensores_simulados()
    
    print("ESTADO DE SENSORES (0-1 escala):")
    
    # Barra de progreso visual para cada sensor
    def barra_progreso(valor, max_barras=10):
        barras = min(int(valor * max_barras), max_barras)
        return '#' * barras + '.' * (max_barras - barras)
    
    print(f"MQ-131 (O3/NO2): {barra_progreso(n131)} {n131:.3f} ({v131:.2f}V)")
    print(f"MQ-135 (NO2)   : {barra_progreso(n135)} {n135:.3f} ({v135:.2f}V)")  
    print(f"MQ-138 (HCHO)  : {barra_progreso(n138)} {n138:.3f} ({v138:.2f}V)")

def mostrar_info_calidad_aire(nivel_ica):
    """Muestra información detallada sobre el nivel de calidad del aire"""
    niveles_info = {
        0: "EXCELENTE - Aire ideal para actividades al aire libre",
        1: "BUENA - Calidad aceptable, poblacion general sin efectos",
        2: "MODERADA - Grupos sensibles deben considerar reducir actividad",
        3: "CONTAMINADA - Todos pueden comenzar a experimentar efectos",
        4: "PELIGROSA - Emergencia sanitaria, evitar exposicion"
    }
    return niveles_info.get(nivel_ica, "Nivel desconocido")

# Programa principal mejorado
print("SISTEMA AVANZADO DE CALIDAD DEL AIRE - 5 NIVELES")
print("================================================")
print("Sensores: MQ-131 (O3/NO2), MQ-135 (NO2), MQ-138 (HCHO)")
print("NIVELES DE CALIDAD DEL AIRE:")
for nivel, datos in NIVELES_CALIDAD_AIRE.items():
    print(f"   {datos['simbolo']} {nivel}: O3<{datos['O3']:.3f}, NO2<{datos['NO2']:.3f}, HCHO<{datos['HCHO']:.3f}")
print("Ciclo de simulacion (80s):")
print("   - 0-20s: Aire excelente")
print("   - 20-35s: Ozono (O3)")
print("   - 35-50s: Dioxido de Nitrogeno (NO2)")  
print("   - 50-65s: Formaldehido (HCHO)")
print("   - 65-80s: Mezcla de contaminantes")
print("================================================\n")

contador = 0
estadisticas = {'correctas': 0, 'total': 0}

while True:
    try:
        contador += 1
        estadisticas['total'] += 1
        
        # Obtener datos de sensores
        gases, ratio1, ratio2, v131, v135, v138 = discriminar_gases(0.08)
        
        print(f"\n" + "="*70)
        print(f"Lectura #{contador} | Simulacion: {gases['gas_simulado']}")
        print("="*70)
        
        # Mostrar estado de sensores
        mostrar_estado_sensores()
        
        print(f"\nANALISIS AVANZADO:")
        print(f"Ratios: MQ131/MQ135={ratio1:.2f}, MQ131/MQ138={ratio2:.2f}")
        
        # CALIDAD DEL AIRE
        print(f"\nCALIDAD DEL AIRE: {gases['simbolo_aire']} {gases['calidad_aire']}")
        print(mostrar_info_calidad_aire(gases['ica_nivel']))
        
        # CONCENTRACIONES ESTIMADAS
        print(f"\nCONCENTRACIONES ESTIMADAS:")
        print(f"   O3:  {gases['concentracion_O3']:.4f} ppm")
        print(f"   NO2: {gases['concentracion_NO2']:.4f} ppm") 
        print(f"   HCHO: {gases['concentracion_HCHO']:.4f} ppm")
        
        # DETECCIONES
        print(f"\nDETECCIONES ACTIVAS:")
        detecciones = []
        if gases['O3']: detecciones.append("OZONO (O3)")
        if gases['NO2']: detecciones.append("DIOXIDO DE NITROGENO (NO2)")
        if gases['HCHO']: detecciones.append("FORMALDEHIDO (HCHO)")
        
        if detecciones:
            for det in detecciones:
                print(f"   DETECTADO: {det}")
        else:
            print(f"   AIRE LIMPIO - Sin contaminantes detectados")
        
        # VERIFICACION DE PRECISION
        precision_correcta = False
        if gases['gas_simulado'] == "AIRE_LIMPIO" and not any([gases['O3'], gases['NO2'], gases['HCHO']]):
            precision_correcta = True
            print("PRECISION: CORRECTO - Aire limpio detectado")
        elif gases['gas_simulado'] == "O3" and gases['O3']:
            precision_correcta = True
            print("PRECISION: CORRECTO - O3 detectado")
        elif gases['gas_simulado'] == "NO2" and gases['NO2']:
            precision_correcta = True  
            print("PRECISION: CORRECTO - NO2 detectado")
        elif gases['gas_simulado'] == "HCHO" and gases['HCHO']:
            precision_correcta = True
            print("PRECISION: CORRECTO - HCHO detectado")
        elif gases['gas_simulado'] == "MIXTO" and sum([gases['O3'], gases['NO2'], gases['HCHO']]) >= 2:
            precision_correcta = True
            print("PRECISION: CORRECTO - Mezcla detectada")
        else:
            print("PRECISION: DISCREPANCIA - Revisar calibracion")
        
        if precision_correcta:
            estadisticas['correctas'] += 1
        
        # ESTADISTICAS
        precision_porcentaje = (estadisticas['correctas'] / estadisticas['total']) * 100
        print(f"\nESTADISTICAS: {estadisticas['correctas']}/{estadisticas['total']} ({precision_porcentaje:.1f}% precision)")
            
    except Exception as e:
        print(f"Error en lectura: {e}")
    
    time.sleep(4)  # Lectura cada 4 segundos