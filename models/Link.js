const {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
    // входящая ссылка будет строкой и требуется обязательно
    from: {type: String, required: true},
    // исходящая ссылка тоже строка и уникальная
    to: {type: String, required: true, unique: true},
    // Кодировка для ссылки
    code : {type: String, required: true, unique: true},
    // Дата создания ссылки по дефолту дата сейчас
    date: {type: Date, default: Date.now},
    // Количество кликов будет номером, по дефолту их 0
    clicks: {type: Number, default: 0},
    // Создатель ссылки вытаскивается его ключ и референс на юзера
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Link', schema)