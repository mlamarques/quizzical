import React from 'react'
import ModalStart from "./components/ModalStart"
import Quiz from "./components/Quiz"
import BlobYellow from "./components/BlobYellow"
import BlobBlue from "./components/BlobBlue"
import Button from './components/Button'
import { mockData } from "./mockData"
import {nanoid} from "nanoid"

export default function App() {
    const [hasStarted, setHasStarted] = React.useState(false)
    const [quizData, setQuizData] = React.useState({})
    const [quizArranged, setQuizArranged] = React.useState([])
    const [areAnswersSelected, setAreAnswersSelected] = React.useState(false)

    React.useEffect(() => {
        async function getQuestions() {
            const res = await fetch("https://opentdb.com/api.php?amount=5&encode=base64")
            const data = await res.json()
            setQuizData(data.results)
        }
        getQuestions()
    }, [hasStarted])

    function ArrangeQuizzes() {
        const arrganged = []

        // {question: x, alt: 1,2,3,4, correct: 3}
        // utf8_to_b64: window.btoa(unescape(encodeURIComponent(str))) 
        // b64_to_utf8: decodeURIComponent(escape(window.atob(str))) 
        for (let i = 0; i < quizData.length; i++) {
            let tempArray = [decodeURIComponent(escape(atob(quizData[i].correct_answer)))]
            tempArray.push(...quizData[i].incorrect_answers.map(item => decodeURIComponent(escape(atob(item)))))

            arrganged.push({
                id: nanoid(),
                question: decodeURIComponent(escape(atob(quizData[i].question))),
                alternatives: tempArray.sort(() => Math.random() - 0.5),
                selected: "",
                correct: decodeURIComponent(escape(atob(quizData[i].correct_answer)))
            })
            tempArray = []
        }
        setQuizArranged(arrganged)
    }

    function handleClick() {
        setHasStarted(true)
        ArrangeQuizzes()
    }

    function checkAnswers() {
        if (areAnswersSelected && hasStarted) {
            async function restartGame() {
                let myPromise = new Promise(function(resolve, reject) {
                  resolve(false);
                });
                setAreAnswersSelected(await myPromise)
                setHasStarted(await myPromise)
              }
            restartGame()
        }
        setAreAnswersSelected(true)
        console.log('Checking answers')
        console.log(areAnswersSelected)
    }

    function toggle(event, id) {
        const {textContent} = event.target
        const tempArray = []
        setQuizArranged(prev => {
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].id === id) {
                    prev[i].selected = textContent 
                }
                tempArray.push(prev[i])
            }
            return tempArray
        })
    }

    function setStyles(question, i, list) {
        if (!areAnswersSelected) { return quizArranged[i].selected === question.alternatives[list] ? styleSelected : styleStandard}

        if (areAnswersSelected) {
            if (quizArranged[i].correct === question.alternatives[list]) {
                return {...styleCorrect, pointerEvents: "none"}
            }
            if (quizArranged[i].selected === question.alternatives[list] && quizArranged[i].selected !== question.correct) {
                return {...styleWrong, opacity: "0.5", pointerEvents: "none"}
            } else {
                return {...styleStandard, opacity: "0.5", pointerEvents: "none"}
            }
        }
    }

    function calculateScore() {
        return quizArranged.reduce((total, item) => item.selected === item.correct ? total + 1 : total, 0)
    }

    const styleStandard = {
        backgroundColor: "transparent",
        border: "1px solid #293264"
    }

    const styleSelected = {
        backgroundColor: "#D6DBF5",
        border: "1px solid rgba(255,255,255,0)"
    }

    const styleCorrect = {
        backgroundColor: "#94D7A2",
        border: "none"
    }

    const styleWrong = {
        backgroundColor: "#F8BCBC",
        border: "none",
        opacity: 0.5
    }
    
    return (
        
        <div className="app">
            {!hasStarted ? <ModalStart handleClick={handleClick} /> :
                <>
                <div className="questions--container">
                    {quizArranged.map((question, i) => {
                        return (
                            <Quiz
                                key={question.id}
                                id={question.id}
                                qTitle={question.question} 
                                optionOne={question.alternatives[0]}
                                // isOneSelected={quizArranged[i].selected === question.alternatives[0]}
                                // styleOne={(event) => changeStyle(event, question.id)}
                                optionTwo={question.alternatives[1]}
                                // isTwoSelected={quizArranged[i].selected === question.alternatives[1]}
                                optionThree={question.alternatives[2]}
                                // isThreeSelected={quizArranged[i].selected === question.alternatives[2]}
                                optionFour={question.alternatives[3]}
                                // isFourSelected={quizArranged[i].selected === question.alternatives[3]}
                                // selected={quizArranged[i].selected}
                                
                                styleOne={setStyles(question, i, 0)}
                                styleTwo={setStyles(question, i, 1)}
                                styleThree={setStyles(question, i, 2)}
                                styleFour={setStyles(question, i, 3)}

                                toggle={(event) => toggle(event, question.id)}
                            />
                        )
                    })}
                   
                </div>
                {areAnswersSelected && <div className="answer--score">You scored {calculateScore()}/5 correct answers</div>}
                <Button class={''} handleClick={checkAnswers} text={!areAnswersSelected ? `Check answers` : `Play again`} />
                </>
            }
            <BlobYellow />
            <BlobBlue />
        </div>
    )
}