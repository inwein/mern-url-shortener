import React from 'react'
import {Link} from 'react-router-dom';

export const LinkList = ({links}) => {

    if (links.length === 0) {
        return (<p className="center">Ссылок пока нет</p>)
    }

    return (
        <table>
        <thead>
          <tr>
              <th>Номер</th>
              <th>Оригинальная</th>
              <th>Сокращенная</th>
              <th>Открыть</th>
          </tr>
        </thead>
         
        <tbody>
         {links.map((link,idx) => {
            return (
        <tr key={link._id}>
            <td>{idx+1}</td>
            <td>{link.from}</td>
            <td>{link.to}</td>    
            <td><Link to={`/detail/${link._id}`}>Открыть</Link></td>  
        </tr>
          )
          })}
        </tbody>
      </table>
            
    )
}