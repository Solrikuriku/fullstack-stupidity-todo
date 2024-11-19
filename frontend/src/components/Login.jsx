import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios' 
import { AuthContext } from '../context/AuthContext'
import './CSS/Registration.css'

const Login = () => {

    const [form, setForm] = useState({
        nickname: '',
        password: ''
    })

    const [error, setError] = useState(null)

    const { login } = useContext(AuthContext)

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form);
    }
    const loginHandler = async () => {
        
        if (!form.nickname.trim() || !form.password.trim()) {
            setError('Please fill in all fields')
            return
        }    
        
        try {
            await axios.post('/api/auth/login', {...form}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer'
                }
            })
            .then(response => {login(response.data.token, response.data.userId)
            setError(null)
            })
        } catch (error) {
            console.log(error)
            setError('Uncorrect nickname/password')
        }
    }

    return (
        <form className='form-login' onSubmit={e => e.preventDefault()}>
        <div className='container'>
            <div className='header'>
                <div className='text'>Login</div>
                <div className='error-message'>
                    {error ? <p>{error}</p> : (<p></p>)}
                </div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input type="nickname" onChange={changeHandler} name="nickname" placeholder='Name'/>
                </div>
                <div className='input'>
                    <input type="password" onChange={changeHandler} name="password" placeholder='Password'/>
                </div>
            </div>
            <div className='submit-container'>
                <button className='login' onClick={() => {loginHandler()}}>Login</button>
                <Link to='/registration'>
                    <button className='registration'>Registration?</button>
                </Link>
            </div>
        </div>
        </form>
    )
}

export default Login