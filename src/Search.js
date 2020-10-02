import React, { useState, useEffect } from 'react';
import './search.css'
import { useParams } from 'react-router-dom';
import QuestionDetails from './QuestionDetails'

function Search() {
    const params = useParams();
    const [searchResult, setSearchResult] = useState([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        setTitle('Loading...')
        setSearchResult([])
        const p = "search="+params.search
        if (p.length > 0) {
            fetch("https://kanjiquizz-server.herokuapp.com/searchAll?"+p)
            .then(response =>  response.json())
            .then(r => {setSearchResult(r); setTitle(r.length + ' result(s)')})
        }
    }, [params])

    return (
        <div className='search'>
            <h1>{title}</h1>
            {searchResult.map(elt => <QuestionDetails key={elt.kanji} question={elt}/>)}
        </div>
    )
}

export default Search