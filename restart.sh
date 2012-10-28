#!/bin/bahs
echo
echo Deteniendo servidor
echo
forever stop servidor.js
echo
echo Update GitHub
echo
git pull origin master
echo
echo Iniciando el servidor
echo
forever start servidor.js
echo
echo Listo
echo
