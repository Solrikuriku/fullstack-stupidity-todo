import React, { useState, useContext, useCallback, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import './MainPage.css'
import check_img from '../assets/check_img.png'
import not_check_img from '../assets/not_check_img.png'
import delete_img from '../assets/delete_img.png'
import exit_img from '../assets/exit_img.png'

const MainPage = () => {

    const [text, setText] = useState('')
    const { userId } = useContext(AuthContext)
    const { logout } = useContext(AuthContext);
    const [todos, setTodos] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(todos.length / itemsPerPage);
    const todosToShow = todos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    const removeTodos = useCallback(async (id) => {

        try {
            await axios.delete(`/api/todo/delete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(() => getTodo())
        } catch (error) {
            console.log(error)
        }
    }, [getTodo])

    const completedTodos = useCallback(async (id) => {
        try {
            await axios.put(`/api/todo/completed/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                setTodos([...todos], response.data)
                getTodo()
            })
        } catch (error) {
            console.log(error)
        }
    }, [getTodo, todos])

    useEffect(() => {
            getTodo()
        }, [getTodo])

    return (
        <div className='main-page'> 
            <div className='navbar-navigate'>
                <img src={exit_img} className='exit-btn' onClick={logout}/>
            </div>
            <form className='form todo' onSubmit={e => e.preventDefault()}>
                <div className="container-mp">
                    <div className="main-page-header">
                        <input 
                            type='text'
                            id='text' 
                            name='input'
                            className='validate' 
                            placeholder='Add Your Task'
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <button className='put-your-task' onClick={() => {createTodo()}}>Add</button>
                    </div>
                </div>
            </form>
            <div className="todos">
                {
                    todosToShow.map((todo, index) => {
                        return (
                            <div className='row-todos-items' key={index}>
                                <div className='todo-text' style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {todo.text}</div>
                                <div className='buttons'> 
                                    <img src={todo.completed ? not_check_img : check_img } className='check' onClick={() => {completedTodos(todo._id)}}/>
                                    <img src={delete_img} className='delete' onClick={() => {removeTodos(todo._id)}}/>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="pagination">
        <button className='previous' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span className='page-text'>Page {currentPage} of {totalPages}</span>
        <button className='next' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
        </div>
    )
}

export default MainPage