import React, { useEffect, useState } from 'react';
import './answerButton.css'

function AnswerButton(props) {

    const [className, setClassName] = useState('grey')
    const [textHiragana, setTextHiragana] = useState('')
    const [textDefinition, setTextDefinition] = useState('')
    const [value, setValue] = useState('')
    const [disabled, setDisabled ] = useState(false)
  
    // Load or refresh
    useEffect(() => {
      setTextHiragana(props.elt.hiragana)
      setTextDefinition(props.elt.definition)
      setValue(props.elt.kanji)
      if (props.unknown) {
        setDisabled(true)
        if (props.question.kanji === props.elt.kanji)
          setClassName('yellow')
      }
    }, [props.elt.kanji, props.elt.hiragana, props.elt.definition, props.question.kanji, props.unknown]);
  
    const checkClick = () => {
      setDisabled(true)
      // CORRECT ANSWER
      if (props.question.kanji === value) {
        setClassName('green')
        props.updateScore(1)
        updateQuestionScore(1)
        setTimeout(() => {props.n(props.question.kanji);}, 500)
      }
      // INCORRECT ANSWER
      else {
        setClassName('red')
        props.changeSerie(props.question.kanji, 1)
      }
    }
  
    const updateQuestionScore = (val) => {
      fetch("https://kanjiquizz-server.herokuapp.com/updateQuestionScore?k="+value+"&s="+val, {method: 'POST'})
      .then(response =>  response.json())
      .then(r => { /**/ })
    }

    return (
            <div className="answerButton">
                <button className={className} onClick={checkClick} disabled={disabled}>
                    <div className="answerButtonHiragana">{textHiragana}</div>
                    <div className="answerButtonDefinition">{textDefinition}</div>
                </button>
            </div>
    )
}

export default AnswerButton;