'use client'
import { setAccount } from "@/store/reducers/currentAccountReducer";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

interface LoginResponse {
    data: {
      name: string
      email: string
      password: string
    }
  }

export const SubmitButton: React.FC = () => {
    const dispatch = useDispatch<any>();
    const router: any = useRouter();
    const currentEmail: string = useSelector((state: any) => state.register.email);
    const currentPassword: string = useSelector((state: any) => state.register.password);
    const currentName: string = useSelector((state: any) => state.register.name);

    const mutation = useMutation<LoginResponse, Error, { name: string, email: string; password: string }>({
        mutationFn: async ({name, email, password}) => {
            if (currentEmail.length > 0 && currentName.length > 0 && currentPassword.length > 0) {
                console.log("Условие для отправки данных солюдены");
                
                const response: any = await axios.post('http://localhost:5400/register', {name, email, password});
                
                return response
            }
            else {
                
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
    const SubmitButton = () => {
        mutation.mutate({
            name: currentName,
            email: currentEmail,
            password: currentPassword
        })
    }

    return (
        <input type="button" value="Зарегистрироваться" className='button-add-account' onClick={SubmitButton}/>      
    )
};
