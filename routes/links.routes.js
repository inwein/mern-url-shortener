// импортируем роутер
const {Router} = require('express');
// импортируем модель Ссылки
const Link = require('../models/Link');
// Вызываем роутер и присваем его местной константе
const route = Router()
// импортируем middleware для работы с юзером
const authmiddle = require('../middleware/auth.middleware');
// импортируем конфиг ради baseUrl
const config = require('config');
// для создания рандомных ссылок;
const shortid = require('shortid')

// Обработка метода пост с адрессом generate
route.post('/generate', authmiddle, async (req, res) => {
    try {
        // Получаем базовый урл и путь ссылки
        const baseUrl = config.get('baseUrl')
        const {from} = req.body
// Рандомный код
        const code = shortid.generate();
        const owner = req.user.userId; 
// Проверяем существует ли такая ссылка уже. Если да - то возвращаем уже созданную такую же
        const existing = await Link.findOne({ from })
        if (existing) {
            return res.json({ link:existing })
        }
// Складываем рандомный урл укороченной ссылки
        const to = baseUrl + '/t/' + code
// Собираем объект Ссылки
        const link = new Link({
            from, to, code, owner
        })
// Ждем сохранения
        await link.save()
// На ответ уходит сохранненный объект со статусом 201 - created
        res.status(201).json({ link })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
// Обработка получение всех ссылок на стартовой странице ссылок
// authmiddle - middleware для получения айди пользователя из токена в запросе
route.get('/', authmiddle, async (req, res) => {
    try {
        // получение все списка всех ссылок по владельцу
        const links = await Link.find({owner: req.user.userId})
        // возврашаем все ссылки как ответ
        // console.log(links)
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
// Обработка получения конкретной ссылки по запросу
route.get('/:id', authmiddle, async (req, res) => {
    try {
        // получение ссылки по айди
        const link = await Link.findById(req.params.id)
        // Возвращаем ссылку как ответ
        res.json(link)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
// Экспорт этого роута
module.exports = route