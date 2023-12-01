const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

// Определите опции для Swagger
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Документация для API myWarehouse app',
        version: '0.1.0',
        description: 'Здесь описаны основные enpoints проекта myWarehouse',
      },
    },
    apis: ['./routes/v1/*.js'], // Путь к файлам содержащие JSDoc-комментарии
  };
  
  const swaggerSpec = swaggerJsdoc(options);

// Используйте Swagger UI для предоставления документации
app.use('/api-docs/:version', swaggerUi.serve, (req, res, next) => {
    // Добавьте динамическую версию к URL Swagger UI
    swaggerUi.setup(swaggerSpec, { swaggerOptions: { url: `/api-docs/${req.params.version}` } })(req, res, next);
  });
  
app.use(express.json());

// Подключение маршрутов
const categoriesRoutes = require('./routes/v1/categories');
const productsRoutes = require('./routes/v1/products');

app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/products', productsRoutes);

// Эндпоинт для загрузки изображений
app.post('/api/v1/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const imagePath = '/uploads/' + req.file.filename;
    res.send('Image uploaded: ' + imagePath);
  });

// Запуск сервера
app.get('/', (req, res) => {
    res.send('API работает!');
  });
  
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });