#!/bin/bash
echo Agregando archivos
git add *
if test $# -lt 1; then
    echo Agregando commit "auto"
    git commit -m "auto commit"
else
    echo Agregando commit $1
    git commit -m $1
fi
echo Subiendo archivos
#git push origin master