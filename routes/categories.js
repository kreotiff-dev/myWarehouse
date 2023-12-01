const express = require('express');
const router = express.Router();
const Category = require('../models/categoriesModel');
const Product = require('../models/productsModel');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Возвращает список категорий.
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Электроника
 *                 subcategories:
 *                   - Смартфоны
 *                   - Телевизоры
 *                   - Холодильники
 *                   - Игровые приставки
 *                   - Бытовая техника
 *               - id: 2
 *                 name: Мебель
 *                 subcategories:
 *                   - Домашняя мебель
 *                   - Мебель для дачи
 *               - id: 3
 *                 name: Одежда
 *                 subcategories:
 *                   - Женская
 *                   - Мужская
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /categories/{categoryId}/products:
 *   get:
 *     summary: Возвращает список товаров по указанной категории.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID категории
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 categoryId: 1
 *                 name: Смартфон
 *                 price: 500
 *                 discountPrice: 450
 *                 description: Описание смартфона
 *                 images:
 *                   - image1.jpg
 *                   - image2.jpg
 *                 rating: 4
 */
router.get('/:categoryId/products', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Категория не найдена' });
      }
  
      const categoryProducts = await Product.find({ categoryId: category._id });
      res.json(categoryProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;