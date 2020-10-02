import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import Question from './Question';
import AnswerButton from './AnswerButton';
import NbQuestions from './NBQuestions';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { QuizzContext } from './QuizzContext';
import './quizz.css'

function Quizz( {showFilter} ) {
    
    const [state, dispatch] = useContext(QuizzContext)
    const [question, setQuestion] = useState(null) // QUESTION (Kanji) to be answer
    const [answersList, setAnswersList] = useState([]) // ANSWER LIST (4 choices)
    const [displayAnswersList, setDisplayAnswersList] = useState(false) // HIDE answer list by default
    const [unknown, setUnknown] = useState(false) // ACTION to display correct answer
    const [nbQuestion, setNbQuestion] = useState('') // RETREIVE TOTAL NUMBER OF QUESTIONS
    const [score, setScore] = useState(0) // RETREIVE TOTAL NUMBER OF QUESTIONS
    const kanjiFilter = state.kanji_filter
    const unknownPercent = state.unknown_percent
    const [localUnknownPercent, setLocalUnknownPercent] = useState(80) // ACTION to display correct answer

    const nextQuestion = useCallback((kanjiToAvoid = '') => {
        fetch(`https://kanjiquizz-server.herokuapp.com/getQuestion?percent=${unknownPercent}&k=${kanjiToAvoid}&f=${kanjiFilter}`)
        .then(response =>  {
            return response.json()
        })
        .then(r => {
            if (r.length === 0) {
                setQuestion({message: 'No more question with this filtering'})
                setAnswersList([])
            } else {
                setDisplayAnswersList(false)
                setUnknown(false)
                r.sort(() => Math.random() - 0.5)
                setQuestion(r[0])
                r.sort(() => Math.random() - 0.5)
                setAnswersList(r)
            }
        })
    }, [kanjiFilter, unknownPercent])

    const changeSerie = (kanji, serie) => {
        setQuestion({...question, serie: serie})
        fetch('https://kanjiquizz-server.herokuapp.com/changeSerie?k='+kanji+'&s='+serie)
        .then(response =>  response.text())
        .then(r => {
            getNBQuestion()     
        })
    }

    const getNBQuestion = () => {
        fetch(`https://kanjiquizz-server.herokuapp.com/getNBQuestion`)
        .then(response =>  response.text())
        .then(r => {
            setNbQuestion(r + ' question(s) in current serie / questions in total')
        })
        .catch(err => console.warn(err))
    }

    const updateScore = (val) => {
        fetch('https://kanjiquizz-server.herokuapp.com/updateScore', {method: 'POST'})
        .then(response =>  response.json())
        .catch(e => console.log("ERROR in update score : " + e))
        .then(r => {
            setScore(r.score)
        })
    }

    const getScore = () => {
        fetch('https://kanjiquizz-server.herokuapp.com/getScore', {method: 'GET'})
        .then(response =>  response.status === 204 ? '' : response.json())
        .catch(e => console.log('Impossible de fetch getScore : ' + e))
        .then(r => {
            if (r) {
                setScore(r.score)
            }
        })
    }

    const showAnswersList = () => {
        setDisplayAnswersList(true)
    }

    const setToKnown = () => {
        setDisplayAnswersList(true)
        changeSerie(question.kanji, 0)
    }

    const setToUnknown = () => {
        setUnknown(true)
        setDisplayAnswersList(true)
        changeSerie(question.kanji, 1)
    }

    function handleUnknownPercentChange(event, value) {
        setLocalUnknownPercent(value)
    }

    function handleUnknownPercentChangeCommited(event, value) {
        dispatch({type: 'SET_UNKNOWN_PERCENT', item: value})
    }

    const handleKanjiFilterChange = (event) => {
        dispatch({type: 'SET_KANJI_FILTER', item: event.target.value})
    }

    useEffect(() => {
        nextQuestion()
        getScore()
        getNBQuestion()
        setLocalUnknownPercent(state.unknown_percent)
    }, [kanjiFilter, nextQuestion, state.unknown_percent])

    const IKnowButton = withStyles(() => ({
        root: {
          backgroundColor: "rgb(88,230,112)",
          '&:hover': { backgroundColor: "rgb(88,230,112)"},
        },
      }))(Button);

      const ShowAnswerButton = withStyles(() => ({
        root: {
          backgroundColor: "rgb(255,67,89)",
          '&:hover': { backgroundColor: "rgb(255,67,89)"},
        },
      }))(Button);


    return <>
        <Question question={question} score={score} />

        <div className='answerList-container'>
            {displayAnswersList ?
                <div className='answerList'>
                    {answersList.map((elt) => <AnswerButton key={elt._id} elt={elt} question={question} n={nextQuestion} unknown={unknown} updateScore={updateScore} changeSerie={changeSerie} />)}
                </div>
            :
                answersList?.length > 0 ? 
                <div className="hideAnswers" onClick={showAnswersList}>Click here to show answers list</div>
                : ''
            }
        </div>
        
        <div className="footer">
            <div className="actionButtonContainer">
                <Link to='/addKanji'>
                <Button variant="contained" className='actionButton' startIcon={<AddBoxIcon />}>Add</Button>
                </Link>
                <ShowAnswerButton variant="contained" className='actionButton' onClick={setToUnknown} disabled={unknown} startIcon={<VisibilityIcon />}>Show answer</ShowAnswerButton>
                <IKnowButton variant="contained" className='actionButton' onClick={setToKnown} disabled={(question?.serie === 0 || unknown) ? true : false} startIcon={<CheckBoxIcon />}>I know</IKnowButton>
                <Button variant="contained" className='actionButton' onClick={() => nextQuestion(question?.kanji)} endIcon={<DoubleArrowIcon />}>Next</Button>
            </div>     
        </div>

        <NbQuestions nb={nbQuestion} />   

        {showFilter ?
        <div className='options'>
            <p>Kanji&nbsp;filter </p>
            <div className="option_kanjifilter"><input type="text" name="KJ" value={state.kanji_filter} onChange={handleKanjiFilterChange} /></div>
            <p>%&nbsp;unknown</p>
            <div className='slider'>
                <Slider 
                defaultValue={80}
                value={localUnknownPercent}
                onChange={handleUnknownPercentChange}
                onChangeCommitted={handleUnknownPercentChangeCommited}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                />
            </div>
        </div>
        : ''
        }
    </>
}

export default Quizz;