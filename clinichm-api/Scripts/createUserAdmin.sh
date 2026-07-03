#!/bin/bash

# Configuración
API_URL='http://localhost:5121/api/Usuario'
API_KEY='QnVydmVsYUFwaVNlY3VyaXR5IzEyMg=='
username="superadmin"
password="admin123"

# Datos del usuario en formato JSON
user_data=$(cat <<EOF
{
  "userName": "$username",
  "nombre": "SuperAdmin",
  "apellido": "Inicial",
  "password": "$password",
  "rolId": "1",
  "celular": "1111111111",
  "sucursalID": 1
}
EOF
)

# Función para formatear JSON básico
format_json() {
    local json="$1"
    echo "$json"
}

# Mostrar información de la operación
echo "\n\033[1;34m🛠️  Creando usuario\033[0m"
echo "┌────────────────────────────────────────────┐"
echo "│ \033[1;36mCredenciales del usuario\033[0m                   │"
echo "├────────────────────────────────────────────┤"
echo "│ \033[1;33mUsuario:\033[0m \033[1;32m$username\033[0m"
echo "│ \033[1;33mPassword:\033[0m \033[1;32m$password\033[0m"
echo "└────────────────────────────────────────────┘\n"

# Realizar la petición
echo "\033[1;33m🔄 Enviando datos al servidor...\033[0m"
response=$(curl -s -w "\n%{http_code}" --location "$API_URL" \
    --header "Content-Type: application/json" \
    --header "x-api-key: $API_KEY" \
    --data "$user_data" 2>&1)

# Verificar errores de conexión
if [ $? -ne 0 ]; then
    echo "\n\033[1;31m❌ Error al conectar con el servidor:\033[0m"
    echo "$response"
    exit 1
fi

# Procesar respuesta
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Mostrar resultados
echo "\n\033[1;34m📬 Respuesta del servidor\033[0m"
echo "┌────────────────────────────────────────────┐"
echo "│ \033[1;36mEstado HTTP:\033[0m \033[1;33m$status_code\033[0m"
echo "└────────────────────────────────────────────┘"

echo "\n\033[1;36mContenido de la respuesta:\033[0m"
format_json "$body"

# Evaluar resultado
if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
    echo "\n\033[1;32m✅ Usuario creado exitosamente\033[0m"
else
    echo "\n\033[1;31m❌ Error al crear el usuario\033[0m"
fi
