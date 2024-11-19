import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import ToDoItems from './ToDoItems';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const ToDo = () => {

    const [text, setText] = useState('')
    const {userId} = useContext(AuthContext)
    const [todos, setTodos] = useState([])
    
    const [todoList, setTodoList] = useState(localStorage.getItem("todos")?
    JSON.parse(localStorage.getItem("todos")) : []);

    const inputRef = useRef();

    const add = () =>{
        const inputText = inputRef.current.value.trim();
        
        if (inputText === "") {
            return null;
        }

        const newTodo = {
            id: Date.now(),
            text: inputText,
            isComplete: false,
        }
        setTodoList((prev)=>[...prev, newTodo]);
        inputRef.current.value = "";
    }

    const deleteTodo = (id) => {
        setTodoList((prvTodos)=>{
            return prvTodos.filter((todo) => todo.id !== id)
        })
    }

    const toggle = (id) => {
        setTodoList((prevTodos)=>{
            return prevTodos.map((todo)=>{
                if(todo.id === id){
                    return {...todo, isComplete: !todo.isComplete}
                }
                return todo;
            })
        })
    }
    const getTodo = useCallback(async () => {
        try {
            await axios.get('/api/todo', {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {userId}
            })
            .then((response) => setTodos(response.data))
        } catch (error) {
            console.log(error)
        }
    }, [userId])

    const createTodo = useCallback(async () => {
        if(!text) return null
        try {
            await axios.post('/api/todo/add', {text, userId}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                setTodos([...todos], response.data)
                setText('')
                getTodo()
            })
        } catch (error) {

        }
    }, [text, userId, todos, getTodo])

    useEffect(()=>{
        localStorage.setItem("todos", JSON.stringify(todoList));
    },[todoList])

    return (
        <div className='main-todo'>
            ToDo
            <div className='to-do-head'>

            </div>

                <form className='to-do-list' onSubmit={e => e.preventDefault()}>
                    <input 
                        ref={inputRef} 
                        id='text' 
                        className='put-your-task' 
                        type={text}
                        placeholder='Add Your Task'
                        onChange={e => setText(e.target.value)}
                    />
                    <button onClick={createTodo} className='add-button'>Add</button>
                </form>

                <div>
                    {todoList.map((item, index)=>{
                        return <ToDoItems key={index} text={item.text} id={item.id}
                        isComplete={item.isComplete} deleteTodo={deleteTodo}
                        toggle={toggle}/>
                    })}
                </div>
                
                <div className='logout'>
                
            </div>

        </div>
    )
}

export default ToDo
