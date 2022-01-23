import React from 'react'
import Button from './Button'

export default function ModalStart(props) {
    return (
        <div className="modal--start">
            <h1 className="title---quizzical">Quizzical</h1>
            <Button class={"modal--btn"} handleClick={props.handleClick} text={`Start`} />
        </div>
    )
}