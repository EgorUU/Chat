'use client'
import '@/scss/login.scss'
import { useDispatch } from 'react-redux';
import { setEmailReg, setPasswordReg, setNameReg } from '@/store/reducers/registerReducer'
import { setAccount } from '@/store/reducers/currentAccountReducer';
import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { SubmitButton } from '../components/SubmitButton';
import axios from 'axios';

const Register: React.FC = () => {
    const dispatch = useDispatch<any>();
    
    const currentEmail: string = useSelector((state: any) => state.register.email);
    const currentPassword: string = useSelector((state: any) => state.register.password);
    const currentName: string = useSelector((state: any) => state.register.name);
    
    return (
        <>
            <div className='main-login'>
                <form className="mb-3 login">
                <label htmlFor="exampleFormControlInput1" className="form-label">Напишите ваш никнейм начиная с символа @</label>
                <input type="text" className="form-control" maxLength={10} id="exampleFormControlInput1" placeholder="Egor" style={{marginBottom: "10px"}} onChange={(e) => dispatch(setNameReg(e.target.value))}/>
                
                
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" style={{marginBottom: "5px"}} onChange={ (e) => {
                               dispatch(setEmailReg(e.target.value)) 
                                                            
                            }
                        }
                    />
                    
                
                    <label htmlFor="inputPassword5" className="form-label">Пароль</label>
                    <input type="password" id="inputPassword5" maxLength={20} className="form-control" aria-describedby="passwordHelpBlock" onChange={(e) => dispatch(setPasswordReg(e.target.value))}/>
                    <div id="passwordHelpBlock" className="form-text">
                    Ваш пароль должен состоять из 8-20 символов, состоять из букв и цифр и не должен содержать пробелов, специальных символов или эмодзи.
                    </div> 
                    <SubmitButton />    
                </form>
            </div>
        </>
    )
};
export default Register
