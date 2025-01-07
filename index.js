const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const app = express();

//settings
app.set("case sensitive routing", true);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

let notes = [];
//set  route of the file

const filePath = path.join(__dirname, "notes.json");

//verificae si el archivo existe y si existe leerlos

if (fs.existsSync(filePath)) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    //convertir el contenido en (objeto JSON) en un arreglo de objetos
    notes = fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    console.error("Error in JSON file", error);
  }
}

//Funcion para escribir datos en el archivo

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

//routes

//consulta de notas
app.get("/notes", (req, res) => {
  res.json(notes);
});

//craer una nueva nota

app.post("/notes", (req, res) => {
  //crear id a nuevo producto

  const getLastIndex = (array) => {
    if (array.length === 0) {
      return undefined;
    }
    return array[array.length - 1];
  };

  const lastElement = getLastIndex(notes);
  console.log(notes[lastElement]);

  let createId = lastElement.id + 1;

  const newNote = { ...req.body, id: createId };

  //agregar el producto al arrerglo
  notes.push(newNote);
  //agregar la acrualizacion del arreglo al archivo
  writeData(notes);
  res.status(201).json(newNote);
});

//update note

app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id === parseInt(id));
  //accion por si no se encuentra nota
  if (noteIndex === -1) {
    return res.status(404).send("product not found");
  }
  //guardar los datos enviados del cliente en una constante
  const data = req.body;
  //pegar la actualizacion al indice del arreglo
  notes[noteIndex] = { ...notes[noteIndex], ...data };
  //pasar la info al archivo

  writeData(notes);
  res.json(notes[noteIndex]);
});

//eliminar nota por ID

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id === parseInt(id));
  if (noteIndex === -1) {
    return res.status(404).send("note not found");
  }

  notes.splice(noteIndex, 1); //eliminar nota
  writeData(notes);
  res.status(204).end();
});

//searching note by ID

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const noteFound = notes.find((p) => p.id === parseInt(id));

  if (!noteFound) {
    return res.status(404).send("note not found");
  }
  res.json(noteFound);
});

app.listen(4000);
console.log(`server on port ${300}`);
