const express = require('express');
const router = express.Router();
const Category = require('../../models/categoriesModel');
const Product = require('../../models/productsModel');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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