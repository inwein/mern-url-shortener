import React, { useState, useEffect, useContext } from 'react';
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/use.message';
import { AuthContext } from '../context/AuthContext';

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])
   
    const changeHandler = event => {
        setForm({...form, [event.target.name] : event.target.value})
    }
    //  функция отсылки запроса при регистрации
    const registerHandler = async () => {
        try {
            // используем request из нашего хука, где указываем пост на url того роута, который привязан
            // на бекенде к регистрации пользователя
        const data = await request('api/auth/register', 'POST', {...form})
        message(data.message)
           
        } catch (error) {}
    }
    const loginHandler = async () => {
      try {
      const data = await request('api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
      } catch (error) {}
  }

    return (
        <div className="row">
        <div className="col s6 offset-s3">
        <h1>Сократи ссылку</h1>
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <span className="card-title">Авторизация</span>
              <div>

            <div className="input-field">
                <input id="email" type="text" 
                name="email" className="yellow-input" onChange={changeHandler}
                value={form.email}/>
                <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
                <input id="password" type="password" 
                name="password" className="yellow-input" onChange={changeHandler}
                value={form.password}/>
                <label htmlFor="password">Пароль</label>
            </div>


              </div>
            </div>
            <div className="card-action">
              
              <button className="btn yellow darken-4" style={{marginRight: '10px'}} 
              disabled={loading} onClick={loginHandler}>Войти</button>
              
              <button className="btn grey lighten-1 black-text" 
              onClick={registerHandler} disabled={loading}>Регистрация</button>
            </div>
          </div>
        </div>
      </div>
        )
} 