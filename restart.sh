#!/bin/bash
echo Deteniendo servidor
forever stop servidor.js
echo Update GitHub
git pull origin master
echo Iniciando el servidor
forever start servidor.js
echo Listo
echo
