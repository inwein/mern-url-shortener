import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { LinkList } from '../components/LinkList'

export const LinksPage = () => {
    const [links, setLinks] = useState()
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchLinks = useCallback( async () => {
        try {
            const data = await request('api/links', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLinks(data)
        } catch (error) {}
    }, [token, request])


    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if (loading) {
        return (<Loader />)
    }
    
    return (
        <div>
            {!loading && links && <LinkList links={links}/>}
        </div>
    )
} 