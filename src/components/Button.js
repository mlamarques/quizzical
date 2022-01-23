import React from 'react'

export default function Button(props) {
    return (
        <button className={`btn ${props.class}`} onClick={props.handleClick}>{props.text}</button>
    )
}