const express = require('express');
const router = express.Router();
const Product = require('../../models/productsModel');
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
  
  /**
   * @swagger
   * /products/upload:
   *   post:
   *     summary: Загружает изображение для продукта.
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Успешная загрузка изображения.
   *         content:
   *           text/plain:
   *             example: 'Image uploaded: /uploads/1617625858661-image1.jpg'
   *       400:
   *         description: Ошибка загрузки изображения.
   */
  router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
      const imagePath = `/uploads/${Date.now()}-${req.file.originalname}`;
      res.send(`Image uploaded: ${imagePath}`);
    } else {
      res.status(400).send('Error uploading image.');
    }
  });

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Возвращает список всех продуктов.
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             example: [...]
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// middleware для получения информации о товаре 
/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Возвращает информацию о конкретном продукте.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID продукта
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             example: {...}
 */
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового продукта
router.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    const createdProduct = await Product.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление информации о продукте
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

// Удаление продукта
router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json({ message: 'Продукт удален успешно' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;