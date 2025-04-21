'use client'
import '@/scss/login.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setEmail, setPassword } from '@/store/reducers/loginReducer'
import { setAccount } from '@/store/reducers/currentAccountReducer'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { api_db } from '@/variables/values'

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
  const [error, setError] = useState(false)
  const mutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
        const response = await axios.post(api_db + '/login', { email, password })
        if (response.data) {
          return response;
        }
        else {
          throw new Error("User is not found");
        }
    },
    onSuccess: (data) => {
      dispatch(setAccount(data.data))
      router.push('/Chat/')
    },
    onError: (err) => {
      console.error("Ошибка входа:", err)
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 1500)
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
          Email
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
          Пароль
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
        <div id="passwordHelpBlock" className="form-text" style={{color: "#e4e3e3"}}>
        Ваш пароль должен состоять из 8-20 символов, состоять из букв и цифр и не должен содержать пробелов, специальных символов или эмодзи.
        </div>
      
        <button 
          type="submit" 
          className={error ? "btn btn-outline-danger" : "button-add-account"} 
          disabled={mutation.isPending || error}
          style={error ? {marginTop: "15px", width: "100%", height: "50px", } : {}}
        >
          {
            mutation.isPending ? (
              <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{marginRight: "5px"}}></span>
                  Входим...
              </>
            ) : error ? (
              <span>Неверный логин или пароль.</span>
            ) :
            
            "Войти"
          }
        </button>
      </form>
    </div>
  )
}

export default Login