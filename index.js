import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './pinturas.json';

function cargarPinturas() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  }
  return [];
}

function guardarPinturas(pinturas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pinturas, null, 2));
}

let pinturas = cargarPinturas();

// Rutas CRUD
app.get('/pinturas', (req, res) => res.json(pinturas));

app.get('/pinturas/:id', (req, res) => {
  const pintura = pinturas.find(p => p.id === parseInt(req.params.id));
  pintura ? res.json({"exito":true, "pintura":pintura}) : res.status(404).json({"exito":false, "mensaje":"Pintura no encontrada"});
});

app.post('/pinturas', (req, res) => {
  const nueva = { id: Date.now(), ...req.body };
  pinturas.push(nueva);
  guardarPinturas(pinturas);
  res.status(201).json({"exito":true, "pintura":nueva});
});

app.put('/pinturas/:id', (req, res) => {
  const index = pinturas.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({"exito":false, "mensaje":"Pintura no encontrada"});
  pinturas[index] = { id: pinturas[index].id, ...req.body };
  guardarPinturas(pinturas);
  res.json({"exito":true, "pintura":pinturas[index]});
});

app.delete('/pinturas/:id', (req, res) => {
  pinturas = pinturas.filter(p => p.id !== parseInt(req.params.id));
  guardarPinturas(pinturas);
  res.status(204).json({"exito":true, "mensaje":"Pintura eliminada"});
});

const PORT = process.env.PORT || 9876;
app.listen(PORT, () => console.log(`Servidor de pinturas en puerto ${PORT}`));
