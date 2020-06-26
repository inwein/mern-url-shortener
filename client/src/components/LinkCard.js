import React from 'react'

export const LinkCard = ({  link}) => {
    return (
    <div>
        <h2>Ссылка:</h2>
        <p>Исходная ссылка: <a href={link.from} target='_blank' rel="noopener noreferrer">{link.from}</a></p> 
        <p>Укороченная ссылка: <a href={link.to} target='_blank' rel="noopener noreferrer">{link.to}</a></p> 
        <p>Кол-во кликов по ссылке: <b>{link.clicks}</b></p> 
        <p>Дата создания: <b>{new Date(link.date).toLocaleDateString()}</b></p>
           
    </div>
    )
}