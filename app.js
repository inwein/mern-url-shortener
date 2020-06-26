// Подключаем нужные пакеты 
const express = require('express'); // Подключение к Експресс, (Сервер)
const config = require('config'); // Подключение к конфигурации - порт и тд
const mongoose = require('mongoose'); // подключение к Монго, (База данных)
const path = require('path'); // Подключение возможности делать путь к папке с фронтом

// Присвоили константе апп старт сервера
const app = express()
// Чтобы правильно обрабатывался JSON при ПОСТ запросах на сервер 
app.use(express.json({extended: true}))
// Подключаем Роут на Авторизацию
app.use('/api/auth', require('./routes/auth.routes'))
// Подключаем Роут на Ссылки
app.use('/api/links', require('./routes/links.routes'))
// Подключаем редирект, для перехода по укороченной ссылке
app.use('/t', require('./routes/redirect.routes'))

// Если мы в продакшен моде
if (process.env.NODE_ENV === 'production') {
    // При запросе титульной страницы - искать в папке клиент - билд 
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    // При любом гет запросе обращаемся к корневому html на фронтенде
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


// Подключаем порт, и пишем капсом и указываем, что если порта нет, то по дефолту это будет 5000
const PORT = config.get('port') || 5000

// Создаем ассинхронную функцию старта сервера
async function start () {
    try {
        // получаем базу данных
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true

        })
        //После получения БД запускаем сервер на порт номер № и слушаем события
        app.listen(PORT, () => {
            console.log(`App has started on ${PORT}...`)
        })
    } catch (e) {
        // если происходит ошибка, пишем ее в консоль и выходим из процесса загрузки
        console.log('Server error: ', e.message),
        process.exit()
    }
}

// Запускаем сервер 
start()