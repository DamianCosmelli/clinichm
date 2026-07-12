#!/bin/bash

cd /workspace/clinichm-api

#Establece los comandos globales de EntityFramework
dotnet tool install --global dotnet-ef

#Instala generador de codigo de dotnet
dotnet tool install -g dotnet-aspnet-codegenerator

#Instala Nugets
dotnet restore

echo "export PATH=\"$PATH:/root/.dotnet/tools\"" >> ~/.bashrc

echo 'source ~/.bashrc' >> ~/.bash_profile

#cambio de permisos - Al ejecutar los comandos lo realiza con el root del contenerdor
# [Necesita recontruir el contenedor]
chmod 777 -R /workspace


