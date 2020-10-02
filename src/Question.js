import React, { useState, useEffect } from 'react';
import './question.css';

function Question(props) {

    const [smallDisplay, setSmallDisplay] = useState(false)
    const {question} = props

    useEffect(() => {
        if (props.question?.kanji?.length > 3) {
            setSmallDisplay(true)
        } else {
            setSmallDisplay(false)
        }
    }, [props.question])

    return ((props.question) ?
            <div className="question">
                {question.message ? 
                    <>
                    <div className="question__message">{question.message}</div> 
                    </>
                :
                    <>
                    <div className={"question"+props.question.serie+(smallDisplay ? '_small' : '')}>{props.question.kanji}</div>
                    <div className="question__score">{props.score}</div>
                    </>
                }
            </div> 
        : ''
        )
    }
    
export default Question;