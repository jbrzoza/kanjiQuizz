import React, { useState } from 'react';
import './header.css';
import { useHistory, Link as RouterLink } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import EqualizerIcon from '@material-ui/icons/Equalizer';

function Header( {showFilter, setShowFilter}) {

    const [searchText, setSearchText] = useState('')
    const history = useHistory();

    const search = () => {
        history.push("/Search/"+searchText)
    }

    const handleKeyPress = (event) => {
        if(event.keyCode === 13) {
            search() 
        }
    }

    return (
        <div className="header">
            <div className="header__title"><RouterLink to="/">Kanji Quizz</RouterLink></div>
            <div className="header__search"><input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyUp={handleKeyPress}/><SearchIcon className='header__searchIcon' onClick={search} /></div>
            <div className="header__filter"><FilterListIcon onClick={() => setShowFilter(!showFilter)}/><RouterLink to="/stats"><EqualizerIcon /></RouterLink></div>
        </div>
    )
}

export default Header;