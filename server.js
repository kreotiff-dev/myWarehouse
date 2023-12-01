const express = require('express');
const app = express();
const port = 3023;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API работает!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
// Заглушки для тестовых данных
const categories = [
    { id: 1, name: 'Электроника', subcategories: ['Смартфоны', 'Телевизоры', 'Холодильники', 'Игровые приставки', 'Бытовая техника'] },
    { id: 2, name: 'Мебель', subcategories: ['Домашняя мебель', 'Мебель для дачи'] },
    { id: 3, name: 'Одежда', subcategories: ['Женская', 'Мужская'] },
  ];
  
  const products = [
    { id: 1, categoryId: 1, name: 'Смартфон', price: 500, discountPrice: 450, description: 'Описание смартфона', images: ['image1.jpg', 'image2.jpg'], rating: 4 },
    // Добавьте другие товары
  ];
  
  // Роут для получения списка категорий
  app.get('/categories', (req, res) => {
    res.json(categories);
  });
  
  // Роут для получения списка товаров по категории
  app.get('/categories/:categoryId/products', (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const category = categories.find((c) => c.id === categoryId);
  
    if (!category) {
      res.status(404).json({ error: 'Категория не найдена' });
      return;
    }
  
    const categoryProducts = products.filter((p) => p.categoryId === categoryId);
    res.json(categoryProducts);
  });
  
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });