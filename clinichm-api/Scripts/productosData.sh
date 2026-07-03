#!/bin/bash

# Configuración
URL='http://localhost:5121/api/importdata/import'
API_KEY='QnVydmVsYUFwaVNlY3VyaXR5IzEyMg=='
SUBCARPETA='dataseed'
ARCHIVO="$(dirname "$0")/$SUBCARPETA/Producto_Plantilla.xlsx"
MODELO='Producto'

# Función para mostrar mensajes de error
show_error() {
    echo "\n\033[1;31m❌ $1\033[0m"
    [[ -n "$2" ]] && echo "\033[1;33mℹ️  $2\033[0m"
    exit 1
}

# Verificar existencia del archivo
if [ ! -f "$ARCHIVO" ]; then
    show_error "Archivo no encontrado" \
    "Asegúrese de que existe la subcarpeta '$SUBCARPETA' con el archivo 'Producto_Plantilla.xlsx'"
fi

# Mostrar información de la operación
echo "\n\033[1;34m📤 Importando datos de Producto\033[0m"
echo "  Modelo: \033[1;36m$MODELO\033[0m"
echo "  Archivo: \033[1;36m$ARCHIVO\033[0m"
echo "  URL: \033[1;36m$URL\033[0m"

# Realizar la petición
echo "\n\033[1;33m🔄 Enviando datos al servidor...\033[0m"
response=$(curl -s -w "\n%{http_code}" --location "$URL/$MODELO" \
    --header "x-api-key: $API_KEY" \
    --form "modelo=\"\\\"$MODELO\\\"\"" \
    --form "file=@\"$ARCHIVO\"" 2>&1)

# Verificar si hubo error en curl
curl_exit_code=$?
if [ $curl_exit_code -ne 0 ]; then
    show_error "Error al conectar con el servidor" "$response"
fi

# Procesar respuesta
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Mostrar resultados
echo "\n\033[1;32m✅ Respuesta del servidor\033[0m"
echo "Código de estado HTTP: \033[1;36m$status_code\033[0m"

# Mensaje final basado en el código de estado
if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
    echo "\n\033[1;32m✔ Importación completada con éxito\033[0m"
else
    echo "\n\033[1;31m✖ Hubo un problema con la importación\033[0m"
fi

echo "\nContenido de respuesta:"
echo "$body"


