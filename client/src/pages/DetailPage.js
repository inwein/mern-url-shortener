import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { LinkCard } from '../components/LinkCard';

export const DetailPage = () => {
    // Забираем контекст, чтобы получить токен
    const {token} = useContext(AuthContext)
    // Забираем реквест, и загрузку, чтобы выставлять лоадер
    const {request, loading} = useHttp ()   
    // Стейт для линка, который будет показываться
    const [link, setLink] = useState(null)
    // Получаем линк айди из нашего урл
    const linkId = useParams().id
    // Получаем ссылку с сервера по айди 
    const getLink = useCallback( async () => {
        try {
            const data = await request(`/api/links/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })

            setLink(data)    
        }
         catch (error) {
            
        }
    }, [token, linkId, request])
// Прогружаем fetch на didmount
    useEffect(() => {
        getLink()
    }, [getLink])

    if (loading) {
        return <Loader />
    }

    return (
        // Синтаксис фрагмента
        <>
        {/* Если загрузка закончилась и линк получен, то вернем карточку ссылки */}
            {!loading && link && <LinkCard link={link}/>}
        </>


    )
} 