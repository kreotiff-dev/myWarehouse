const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 3023;

// Настройка multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Папка, куда будут сохраняться изображения
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
    },
  });
  
  const upload = multer({ storage: storage });

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/myWarehouseDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Загрузка файла swagger.yaml
const swaggerDocument = YAML.parse(fs.readFileSync('./docs/swagger.yaml', 'utf8'));

// Используйте Swagger UI для предоставления документации
app.use('/api-docs/:version', swaggerUi.serve, (req, res, next) => {
    // Добавьте динамическую версию к URL Swagger UI
    swaggerUi.setup(swaggerDocument, { swaggerOptions: { url: `/api-docs/${req.params.version}` } })(req, res, next);
  });

app.use(express.json());

// Подключение маршрутов
const categoriesRoutes = require('./routes/v1/categories');
const productsRoutes = require('./routes/v1/products');

app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/products', productsRoutes);

// Запуск сервера
app.get('/', (req, res) => {
    res.send('API работает!');
  });
  
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });