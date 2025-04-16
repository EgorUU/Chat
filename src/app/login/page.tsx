'use client'
import '@/scss/login.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setEmail, setPassword } from '@/store/reducers/loginReducer'
import { setAccount } from '@/store/reducers/currentAccountReducer'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

interface LoginResponse {
  data: {
    email: string
    password: string
  }
}

const Login: React.FC = () => {
  const dispatch = useDispatch()
  const currentEmail = useSelector((state: any) => state.login.email)
  const currentPassword = useSelector((state: any) => state.login.password)
  const router = useRouter()

  const mutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
        const response = await axios.post('http://localhost:5400/login', { email, password })
        console.log(response);
        return response
    },
    onSuccess: (data) => {
      dispatch(setAccount(data.data))
      router.push('/')
    },
    onError: (err) => {
      console.error("Ошибка входа:", err)
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      email: currentEmail,
      password: currentPassword
    })
  }

  return (
    <div className='main-login'>
      <form className="mb-3 login" onSubmit={handleSubmit}>
        <label htmlFor="emailInput" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          placeholder="name@example.com"
          style={{ marginBottom: "5px" }}
          value={currentEmail}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          required
        />
      
        <label htmlFor="passwordInput" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="passwordInput"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          value={currentPassword}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          required
        />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </div>
      
        <button 
          type="submit" 
          className="button-add-account" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Входим..." : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default Login