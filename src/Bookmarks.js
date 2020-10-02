import React, { useContext } from 'react';
import { QuizzContext } from './QuizzContext'
import { useHistory } from "react-router-dom";
import './bookmarks.css'

function Bookmarks() {
    const [state] = useContext(QuizzContext)
    const history = useHistory();

    return (
        <div class="boomarks">
            <h1>Bookmarks</h1>
            <ul>
                {state.bookmarks.map((elt) => (<li key={elt.kanji}>{elt.kanji} | {elt.hiragana} | {elt.definition}</li>))}
            </ul>
        <button onClick={() => { history.push('/'); }} >BACK</button>
        </div>
    )
}

export default Bookmarks