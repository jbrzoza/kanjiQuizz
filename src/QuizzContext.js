import React, { createContext, useReducer } from 'react'

export const QuizzContext = createContext();
const initialState = {kanji_filter: '', unknown_percent: 80}

function reducer(state, action) {
    console.log("DISPATCH " + action.type)
    switch(action.type) {
        case 'SET_KANJI_FILTER':
            var filter = action.item
            console.log("On filtre sur " + filter)
            return {...state, kanji_filter: filter}
        case 'SET_UNKNOWN_PERCENT':
            var unknown_percent = action.item
            return {...state, unknown_percent: unknown_percent}
        case 'ADD_BOOKMARK':
            var currentBookmark = state.bookmarks
            var found = currentBookmark.findIndex(element => element.kanji === action.item.kanji);
            if (found === -1) {
                return {bookmarks: [...state.bookmarks, action.item]}
            }
            else {
                return state
            }
        case 'DELETE_BOOKMARK':
            currentBookmark = state.bookmarks
            found = currentBookmark.findIndex(element => element.kanji === action.item.kanji);
            console.log("FOUND = " + found)
            if (found >= 0) {
                currentBookmark.splice(found, 1)
            }
            return {bookmarks: currentBookmark}
        default:
            return state
    }
}

export const QuizzProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <QuizzContext.Provider value={[state, dispatch]}>
            {children}
        </QuizzContext.Provider>
    )
}