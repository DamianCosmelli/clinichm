# Usar una imagen base de Node.js para construir la aplicación
FROM node:18-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias y construir la aplicación
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código fuente de la aplicación
COPY . .

# Aumentar el límite de memoria del heap de Node.js
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Construir la aplicación para producción
RUN npm run build

# Usar una imagen base de nginx para servir la aplicación
FROM nginx:stable-alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Comando por defecto para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]