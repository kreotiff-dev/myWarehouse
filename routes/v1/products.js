const express = require('express');
const router = express.Router();
const Product = require('../../models/productsModel'); // убрал .default
const multer = require('multer');
const path = require('path');

// Мультер middleware для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
      const imagePath = `/uploads/${Date.now()}-${req.file.originalname}`;
      res.send(`Image uploaded: ${imagePath}`);
    } else {
      res.status(400).send('Error uploading image.');
    }
  });

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// middleware для получения информации о товаре 

router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    console.log('Full req object:', req);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    const createdProduct = await Product.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const updatedProduct = req.body;
  try {
    const existingProduct = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json(existingProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:productId', async (req, res) => {
    // console.log('Start of deletion handler'); 
    const productId = req.params.productId;
  try {
    // console.log('Deleting product with ID:', productId);
    // console.log('Full req object:', req);
    // console.log('req.params:', req.params);
    const deletedProduct = await Product.findByIdAndDelete(productId);
    // console.log('End of deletion handler');
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json({ message: 'Продукт удален успешно' });
  } catch (error) {
    // console.error('Error during deletion:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});


module.exports = router;