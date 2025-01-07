const express = require("express");

const app = express();

const notas = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

notas.splice(2, 1);
console.log(notas);

const getLastElement = (array) => {
  if (array.length === 0) {
    return undefined;
  }
  return array[array.length - 1];
};

const lastNumber = getLastElement(notas);

const asignacionId = lastNumber.id + 1;

const nuevo = { ...notas, id: asignacionId };
notas.push(nuevo);
console.log(notas);
