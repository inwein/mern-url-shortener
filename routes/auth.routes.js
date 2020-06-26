// Подключаем нужный модуль Роутер и создаем роутер через константу
const {Router} = require('express')
const router = Router()
// Подключаем модель Пользователя
const User = require('../models/User');
// Подключаем библиотеку BCRYPT для хеширования(шифрования) паролей, которые указывает пользователь
const bcrypt = require('bcrypt');
// Подключаем express-validator для валидации формы авторизации/регистрации
const {check, validationResult} = require('express-validator')
// jsonwebtoken для создания токена
const jwt = require('jsonwebtoken');
// подключаем конфиг чтобы забирать оттуда jwt ключ
const config = require('config');


// Создаем обработчик для метода POST, полный url: /api/auth/register, т.к. первую часть подключили в app.js
router.post(
    '/register', 
    // в описании методов пост - можем добавлять больше двух переменных
    [
        // Вешаем проверку на email, первый идет поле для проверки, второе - текст в случае ошибки, 
        // и встроенный метод isEmail проверяет его валидность
        check('email', 'Некорректный email').isEmail(),
        // По аналогии с email, и встроенным методом isLength указываем в объекте минимальную длину
        check('password', 'Минимальная длина пароля - 6 символов').isLength({min: 6})
    ],
    // req - Request, res - Response. Важно использовать ! ASYNC !
    async (req, res) => {
    try {
        // Прежде всего нужно проверить подходит ли пароль и почта под нормы и требования
        // Помещаем запрос с данными в validationResults, где запрос проходит проверки описанные выше
        const errors = validationResult(req)
        // Если ошибки не пустые то возвращаем на фронт енд наши ответы на ошибки в виде массива, так 
        // как их может быть несколько
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные при регистрации в системе"
            })
        }
        // деструктуризируем тело запроса на почту и пароль
        const {email, password} = req.body
        // Через метод модели findOne ищем совпадает ли имейл из запроса тому имейлу, который уже имеется в 
        // какой то модели, какого то пользователя.
        const candidate = await User.findOne({ email })
        // Если такой кандидат уже зарегистрирован, то выдаем ошибку 400 с текстом message
        // ВАЖНО писать await иначе постоянно будет true
        if (candidate) {
            return res.status(400).json({message: 'Такой пользователь уже зарегистрирован'})
        }
        // Если проверка выше пройдена, то регистрируем пользователя
        // Хешируем пароль через bcrypt
        const hashedPassword = await bcrypt.hash(password, 12)
        // Создаем нового Юзера, через конструктор модели Юзера
        // Имейл остается тотже, поэтому его указываем один раз, а в пароль идет захешированная версия
        const user = new User ({email, password: hashedPassword})
        // Запускаем асинхронный метод у нового юзера с целью сохранить его
        await user.save()
        // После окончания сохранения возвращаем успешный статус и сообщение message
        res.status(201).json({message: 'Аккаунт успешно создан'})
    } catch(e) {
        // Если происходит ошибка при обработке пост запроса, мы ставим ей статус №500 - серверная ошибка 
        // и задаем кастомное сообщение, которое вернется как response в message
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
// Обработчик для метода пост прилогине
router.post('/login', 
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        
        try {
            const errors = validationResult(req);       
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные при входе в систему"
            })
        }
        
        const {email, password} = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }
        // проверка введенного пароля через bcrypt так как пароль захеширован и находит его по мейлу юзера
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Неверный пароль'})
        }
        // если проверки пройдены начинаем авторизацию пользователя
        // создаем токен через .sign куда передаем 3 параметра: 1 - id пользователя, 2 - секретный ключ,
        // 3 - срок годности токена
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        // Статус не задаем , так как он по умолчанию 200 и передаем токен и присваиваем userid
        res.json({token, userId: user.id})

    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
}
)
module.exports = router