import React, { useState } from 'react'
import axios from 'axios' 
import './CSS/Registration.css'
import { Link } from 'react-router-dom'

const Registration = () => {

    const [form, setForm] = useState({
        nickname: '',
        email: '',
        password: '',
        repeat_password: ''
    })

    const [regstate, setState] = useState(null)

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
        console.log(form);
    }

    const registerHandler = async () => {

        if (!form.nickname.trim() || !form.email.trim() || !form.password.trim() || !form.repeat_password.trim()) {
            setState('Please fill in all fields')
            return
        }
        else if (form.password !== form.repeat_password) {
            setState('Passwords must be match')
            return
        }

        try {
            await axios.post('/api/auth/registration', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => console.log(response))
            setState('Successfully')
        } catch (error) {
            console.log(error)
            setState(error.response.data.message)
        }
    }

    return (
        <form className='form-registration' onSubmit={e => e.preventDefault()}>
        <div className='container'>
            <div className='header'>
                <div className='text'>Registration</div>
                <div className='error-message'>
                    {regstate ? <p>{regstate}</p> : (<p></p>)}
                </div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input type="nickname" name="nickname" onChange={changeHandler} placeholder='Name'/>
                </div>
                <div className='input'>
                    <input type="email" name="email" onChange={changeHandler} placeholder='Email'/>
                </div>
                <div className='input'>
                    <input type="password" name="password" onChange={changeHandler} placeholder='Password'/>
                </div>
                <div className='input'>
                    <input type="password" name="repeat_password" onChange={changeHandler} placeholder='Repeat password'/>
                </div>
            </div>
            <div className='submit-container'>
                <button className='registration' onClick={() => {registerHandler()}}>Registration</button>
                <Link to='/login'>
                    <button className='login'>Login?</button>
                </Link>
            </div>
        </div>
        </form>
    )
}

export default Registration