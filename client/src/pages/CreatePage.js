import React, { useState, useContext } from 'react';
import {useHistory} from 'react-router-dom'
import { useHttp } from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';

export const CreatePage = () => {
    // используем для редиректа при создании ссылки
    const history = useHistory()
    // Контекст, чтобы получить токен
    const auth = useContext(AuthContext)
    // Для обработки запроса
    const {request} = useHttp()
    // Тут хранится ссылка введенная в инпут
    const [link, setLink] = useState('')
// Обработчик при нажатии на Enter
    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/links/generate', 'POST', {from: link}, 
                // Добавляем в Headers токен из контекста
                {
                    Authorization: `Bearer ${auth.token}`
                })
                // Сразу после того как добавили новую ссылку переходим на страницу с детальный описанием
                // только что созданной ссылки
                history.push(`/detail/${data.link._id}`)                
            } catch (error) {}
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input id="link" type="text"
                    value={link}
                    name="link" onChange={e => setLink(e.target.value)}
                    onKeyPress={pressHandler}/>
                    <label htmlFor="link">Введите ссылку</label>
                </div>            
            </div>      
        </div>
    )
} 