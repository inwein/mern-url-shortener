// имортируем, чтобы декодировать токен с использованием сикрета
const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = (req, res, next) => {
try {
// если метод Options то вызываем следующую функцию, это бывает системны запросом, нам нужно его игнорить
    if (req.method === 'OPTIONS') {
        return next()
    }   
// получаем токен. Он лежит в Headers запроса, в вкладке authorization, формат "Bearer TOKEN"
// Делаем сплит, чтобы получить массив, где 1 индекс - всегда токен
    const token = req.headers.authorization.split(' ')[1]
// если токена там нет, выдадим ошибку. Возвращаем, чтобы функция дальше не шла
    if (!token) {
        return res.status(401).json({ message: 'Вы не авторизованы' })
    }
// Декодируем токен через импортированную библиотеку, также нужно из конфига взять секретку, чтобы
// все сработало правильно 
    const decoded = jwt.verify(token, config.get('jwtSecret'))
// Добавляем в запрос поле юзер, куда зайдет декодированная информация с токена
    req.user = decoded
    next()
} catch (error) {
    res.status(401).json({ message: 'Вы не авторизованы' })
}
}