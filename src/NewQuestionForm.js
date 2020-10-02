import React from 'react';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import './newQuestionForm.css';

function NewQuestionForm(props) {

    const questionDef = {kanji: '', hiragana: '', definition: '', score:0, serie: 1}
    const [newQuestion, setNewQuestion] = useState(questionDef)
    const [message, setMessage] = useState([])
    const [messageClass, setMessageClass] = useState('')
    const history = useHistory();

    const findKanji = () => {
      const params = "k="+newQuestion.kanji
      fetch("https://kanjiquizz-server.herokuapp.com/findQuestion?"+params)
      .then(response => {
        if (response.status === 204) {
          showMessage("No kanji found for " + newQuestion.kanji)
        } else if (response.status === 200) {
          return response.json()
        }
        else {
          showMessage("Error while looking for " + newQuestion.kanji, 'error')
        }
      })
      .then(r => { 
        if (r) {
          setNewQuestion(r)
          showMessage("Kanji " + r.kanji + " found", 'ok')
        }
      })
      .catch(e => console.log(e))
      }

    const addUpdateKanji = () => {      
      fetch('https://kanjiquizz-server.herokuapp.com/addUpdateQuestion', {method: 'POST', headers: { "Content-Type": "application/json"} , body: JSON.stringify(newQuestion)})
      .then(response =>  response.json())
      .then(r => {
        showMessage("Insert/update OK for " + r.kanji, 'ok')
        setNewQuestion(questionDef)  
      })
    }

    const deleteKanji = () => {      
      const params = "k="+newQuestion.kanji
      fetch("https://kanjiquizz-server.herokuapp.com/deleteQuestion?"+params, {method: 'DELETE', headers: {'Content-Type': 'application/json'}})
      .then(response =>  response.json())
      .then(r => {
        showMessage("Delete OK for " + r.kanji, 'ok')
        setNewQuestion(questionDef)
      })
    }

    const showMessage = (msg, status = '') => {
      setMessageClass(status)
      setMessage([new Date().toLocaleTimeString("fr-FR"), msg])
    }

    const handleKanjiChange = (event) => {
      setNewQuestion({...newQuestion, kanji:event.target.value})
    }

    const handleHiraganaChange = (event) => {
      setNewQuestion({...newQuestion, hiragana:event.target.value})
    }

    const handleDefinitionChange = (event) => {
      setNewQuestion({...newQuestion, definition:event.target.value})
    }

    const handleSerieChange = (event) => {
      setNewQuestion({...newQuestion, serie:event.target.value})
    }

    return(
      <div className='newQuestion'>
      <h1>Add a new Kanji</h1>
      <div className="newQuestionForm">
        Kanji <input type="text" name="kanji" size="20" onChange={handleKanjiChange} onBlur={findKanji} value={newQuestion.kanji}></input>
        Hiragana <input type="text" name="hiragana" size="20" onChange={handleHiraganaChange} value={newQuestion.hiragana}></input>
        Definition <input type="text" name="definition" size="35" onChange={handleDefinitionChange} value={newQuestion.definition}></input>
        Serie <input type="text" name="serie" size="1" onChange={handleSerieChange} value={newQuestion.serie}></input>
        <div className="newQuestionFormButton">
          <Button variant="contained" onClick={deleteKanji} startIcon={<DeleteIcon />}>Delete</Button>
          <Button variant="contained" onClick={addUpdateKanji} startIcon={<AddBoxIcon />}>Add / Update</Button>
        </div>
        <div className={`newQuestionFormMessage ${messageClass}`}>
          <label>[{message[0]}] <b>{message[1]}</b></label>
        </div>
      </div>
      <div className="newQuestionReturnButton"><Button variant="contained" onClick={() => { history.push('/'); }} startIcon={<KeyboardReturnIcon />}>Back</Button></div>
      </div>
    )
}

export default NewQuestionForm;