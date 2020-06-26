import {useState, useCallback, useEffect} from 'react'
// просто чтобы не дублировать название
const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);
    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)
        // закидываем в localstorage, испольщуя json.stringify, чтобы правильно сохранилось инфо
        localStorage.setItem(storageName, JSON.stringify({
           token: jwtToken, userId: id
        }))
    }, [])

    // просто чистим стейт с данными и вычищаем локалСтор
    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem(storageName)
    }, [])
    // В момент подгрузки страницы - аналог компонентдидмаунт запрашиваем из локалстора инфо по токену и айди
    // Обязательно парсим его, так как в локалсторе он хранится в стринге, а нам нужен объект
    // дальше узнаем если дата не пустая и есть токен, то логинимся используя взятую из локалстора инфу
    // В качестве зависимости передаем login, чтобы использовать его
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token) {
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, ready}   
}