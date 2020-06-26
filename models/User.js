// Получаем нужные объекты для работы с моделью Пользователя
const {Schema, model, Types} = require('mongoose')

// описываем характеристики схемы модели
const schema = new Schema ({
    // Тип - Строка, обязательно указывать - да, уникальный - да
    email: {type: String, required: true, unique: true},
    password : {type: String, required: true},
    // Так как сайт будет для ссылок, в пользователя подключаем массив ссылок, которые он будет добавлять
    links: [{type: Types.ObjectId, ref: 'Link'}]
    // Тип из МонгоДБ, а Реф - это ссылка на следующую модель, которая будет описываться отдельно
})


// Передаем схему на экспорт в качестве Модели, задавая имя user, а в качестве объекта модели идет schema
module.exports = model('User', schema)