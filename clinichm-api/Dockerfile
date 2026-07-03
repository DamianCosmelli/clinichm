# Usar una imagen base de .NET SDK para compilar la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copiar los archivos del proyecto y restaurar las dependencias
COPY clinichm-api.csproj ./
RUN dotnet restore

# Copiar el resto de los archivos y compilar la aplicación
COPY . ./
RUN rm -rf Tests
RUN dotnet publish clinichm-api.csproj -c Release -o out

# Usar una imagen base de .NET Runtime para ejecutar la aplicación
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 80

# Configurar la entrada del contenedor
ENTRYPOINT ["dotnet", "clinichm-api.dll"]