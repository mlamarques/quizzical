import React from 'react'

export default function Quiz(props) {
    

    return (
        <div className="quiz--container" id={props.id} >
            <h2 className="quiz--question">{props.qTitle}</h2>
            <div className="quiz--alternatives">
                {props.optionOne && <div style={props.styleOne} onClick={props.toggle} className="quiz--each--question">{props.optionOne}</div>}
                {props.optionTwo && <div style={props.styleTwo} onClick={props.toggle} className="quiz--each--question">{props.optionTwo}</div>}
                {props.optionThree && <div style={props.styleThree} onClick={props.toggle} className="quiz--each--question">{props.optionThree}</div>}
                {props.optionFour && <div style={props.styleFour} onClick={props.toggle} className="quiz--each--question">{props.optionFour}</div>}
            </div>
        </div>
    )
}