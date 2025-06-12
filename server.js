import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbUri = 'mongodb+srv://admin:admin@basedw4.mh62xkp.mongodb.net/?retryWrites=true&w=majority&appName=BaseDW4';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(dbUri, clientOptions).then(() => {
  console.log("Conectado a MongoDB");
}).catch(err => {
  console.log("Error al conectar a MongoDB:", err);
});

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String
});

const Producto = mongoose.model('Product', productSchema);

app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const nuevoProducto = new Producto({ nombre, precio, descripcion });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(id, { nombre, precio, descripcion }, { new: true });
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});
