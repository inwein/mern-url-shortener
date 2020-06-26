import {useState, useCallback} from 'react';
// создаем собственный хук для http запросов

export const useHttp = () => {
    // создаем 3 переменные, которые поедут на экспорт   
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    // используем useCallback хук для того, чтобы избежать проблем с вложеностью функций в Реакт
    const request = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setLoading(true)
            try {
                if (body) {
                    // приводим в порядок боди Важно!! чтобы правильно отсылались данные 
                    body = JSON.stringify(body)
                    // важно указать тип контента, что это json, чтобы сервер его правильно считывал
                    headers['Content-type'] = 'application/json'
                }
             const response = await fetch(url, {method, body, headers})
             const data = await response.json()
             if (!response.ok) {
                 throw new Error(data.message || 'Что-то пошло не по плану...')
             }
             
             setLoading(false)
             return data

            } catch (e) {
              setLoading(false)
              setError(e.message)
              throw e 
            }   
            
        }, [])
// очистка ошибок 
        const clearError = useCallback( () => setError(null), [])

        return {loading, request, error, clearError}
}