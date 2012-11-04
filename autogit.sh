#!/bin/bash
echo Agregando archivos
git add *
echo Agregando commit "auto"
git commit -m "auto commit"
echo Subiendo archivos
git push origin master
git push org master