'use client'
import { setAccount } from "@/store/reducers/currentAccountReducer";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IRegisterState } from "@/types/user.interface";

interface LoginResponse {
    data: {
        name: string
        email: string
        password: string
    }
}
export const SubmitButton: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentEmail: string = useSelector((state: any) => state.register.email);
    const currentPassword: string = useSelector((state: any) => state.register.password);
    const currentName: string = useSelector((state: any) => state.register.name);
    const [error, setError] = useState<boolean>(false)
    const mutation = useMutation<LoginResponse, Error, IRegisterState>({
        mutationFn: async ({name, email, password}) => {
            if (currentEmail.length > 0 && currentName.length > 0 && currentPassword.length > 0 && currentName[0] == '@') {
                setError(false)
                console.log("Условие для отправки данных солюдены");
                
                const response: any = await axios.post('http://localhost:5400/register', {name, email, password});
                
                if (response.data) {
                    return response
                }

                else {
                    throw new Error('Ошибка при регистрации!')
                }
            }
            else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 1500)
            }
        },
        onSuccess: async (data) => {
            await dispatch(setAccount(data.data));  
            console.log(currentName);
                          
            router.push('/')
        },
        onError: (err) => {
            console.log("Ошибка", err);
            
        }
    })
    const SubmitButton = (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutation.mutate({
            name: currentName,
            email: currentEmail,
            password: currentPassword
        })
    }

    return (
        <>
            {
                error ? <button type="button" className="btn btn-outline-danger" style={{marginTop: "15px", width: "100%", height: "50px", }}>Пожалуйста, правильно заполните все формы!</button> 
                : <button className='button-add-account' onClick={SubmitButton}>{mutation.isPending ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{marginRight: "5px"}}></span>
                    Регистрируемся...
                </>): "Зарегистрироваться"}
                </button>
                
            }
        </>
             
    )
};
