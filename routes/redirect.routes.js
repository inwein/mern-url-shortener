const {Router} = require ('express')
const router = Router()
const Link = require('../models/Link')

router.get('/:code', async (req,res) => {
    try {
        // Ищем линк по коду из параметров
        const link = await Link.findOne({code: req.params.code})

        if (link) {
            // Плюсуем к свойству ссылки один клик
            link.clicks++
            // Сохраняем добавленный клик
            await link.save()
            // И запускаем пользователя по изначальной ссылке
            return res.redirect(link.from)
        } 
        
        res.status(400).json('Ссылка не найдена')

    } catch (error) {
        res.status(500).json({message:'Что-то пошло не так'})
    }
})


module.exports = router