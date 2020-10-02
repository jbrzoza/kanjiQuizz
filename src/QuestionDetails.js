import React from 'react';
import './questionDetails.css';

function QuestionDetails({ question }) {
    return (
        <div className='questionDetails'>
            <div className='questionDetails__kanji'>{question.kanji}</div>
            <div className='questionDetails__hd'>
                <div className='questionDetails__hiragana'>{question.hiragana}</div>
                <div className='questionDetails__definition'>{question.definition}</div>
            </div>
            <div className='questionDetails__ss'>
                <div className='questionDetails__serie'>Serie: {question.serie}</div>
                <div className='questionDetails__score'>Score: {question.score}</div>
            </div>
        </div>
    )
}

export default QuestionDetails
