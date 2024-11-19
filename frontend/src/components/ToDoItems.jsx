import React from 'react'
import check from '../assets/check.png'
import not_check from '../assets/not_check.png'
import trash from '../assets/garbage.png'
import './CSS/ToDoItems.css'

const ToDoItems = ({text, id, isComplete, deleteTodo, toggle}) => {
    return (
        <div className='to-do-item'>
            <div onClick={()=>{toggle(id)}} className="item">
                <img src={isComplete ? check : not_check} alt="" className='check-icon'/>
                <p className='task' style={{textDecoration : isComplete ? 'line-through' : 'none'}}>{text}</p>
            </div>
            
            <img onClick={()=>{deleteTodo(id)}} src={trash} alt="" className='trash-icon'/>

        </div>
    )
}

export default ToDoItems