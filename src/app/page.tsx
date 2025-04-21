'use client'
import '@/scss/chat.scss'
import { GoPaperclip } from "react-icons/go";
import { GoPaperAirplane } from "react-icons/go";
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { ICurrentAccount } from '@/types/user.interface';
import '@/scss/media.scss'
import { api_chat } from '@/variables/values';
interface IMessage {
    text: string,
    userId: number,
    userName: string,
    time: string
}

interface ICurrentAcc {
    currentAccount: ICurrentAccount
}

const Page: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [socket, setSocket] = useState<any>(null);
    useEffect(() => {
        const newSocket: any = io(api_chat, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        setSocket(newSocket)

        newSocket.on('connect_error', (err: Error) => {
            console.error('Ошибка подключения:', err.message);
        });

        newSocket?.on('create_message', (data: IMessage) => {
            
            
            setMessages((prev: IMessage[])=> [...prev, data])
        }, [])

        newSocket?.on('load_history', (messagesArray: IMessage[]) => {
            
            setMessages((prev: IMessage[]) => [...prev, ...messagesArray])
            
            
        })

        return () => {
            newSocket.off('create_message');
            newSocket.disconnect();
        };
    }, [])


    const linkMessage = useRef<HTMLDivElement | null>(null)

    
    useEffect(() => {
        linkMessage?.current?.scrollIntoView();
    }, [messages])

    const inputMessage = useRef<HTMLInputElement | null>(null)

    const sendMessage = async () => {
        
        if (inputMessage?.current?.value != '') {
            await socket.emit('send_message', {text: inputMessage.current?.value, userId: currentAccount.id , userName: currentAccount.name ? currentAccount.name : "Неизвестный", time: `${new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours()}:${new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()}`})
            if (inputMessage.current) {
                inputMessage.current.value = '';
                inputMessage.current.blur()
            }
        }
    }

    const useWindowHeight = () => {
        const [height, setHeight] = useState(window.innerHeight);
        
        useEffect(() => {
            const handleResize = () => {
            setHeight(window.innerHeight);
            };
        
            window.addEventListener('resize', handleResize);
            
            return () => {
            window.removeEventListener('resize', handleResize);
            };
        }, []);
        
        return height;
    }
    
    const currentAccount = useSelector((state: ICurrentAcc) => state.currentAccount);
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    }, [sendMessage]);
    useEffect(() => {
        const inputEl = inputMessage.current;
        if (!inputEl) return;

        const handleFocus = () => {
            document.addEventListener('keydown', handleKeyDown);
        };
        
        const handleBlur = () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

        inputEl.addEventListener('focus', handleFocus);
        inputEl.addEventListener('blur', handleBlur);

        return () => {
            inputEl.removeEventListener('focus', handleFocus);
            inputEl.removeEventListener('blur', handleBlur);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    return (
        <>
            {currentAccount.name.length > 0 ? (
                <div className='messager-main' style={{height: `${useWindowHeight() - 56}px`}}>
                <div className="messager">
                    <div className='messager__chat-background'>
                        <div className="messager__chat">
                            <div className="messager__chat-messages" >
                                {
                                    messages.map((message: IMessage, index: number) => (
                                        
                                             <div className={`messager__chat-messages-message ${currentAccount.id == message.userId ? "you" : ""}`} key={index}>   
                                                <div className='messager__chat-messages-message-container'>
                                                    <h3 className='messager__chat-messages-message-name'>{message.userName}</h3>                          
                                                    <h1>{message.text}</h1>
                                                </div>
                                                <h2 className='messager__chat-messages-message-time'>{message.time}</h2>
                                            </div>
                                        
                                    ))
                                }
                                <div ref={linkMessage}></div>
                            </div>
                            <div className="messager__chat-input">
                                <div className='file' title='Прикрепить Файл'>
                                    <GoPaperclip />
                                </div>
                                <input type="text" ref={inputMessage}  placeholder='Напишите Сообщение'/>
                                <button className='send' title='Отправить' onClick={sendMessage}>
                                    <GoPaperAirplane/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            ): <div className='welcome'>
                <h1>Добро пожаловать в Chat!</h1>
                <h2>Для общения <Link href="/login">Войдите</Link> в аккаунт, или <Link href="/register">Зарегистрируйтесь.</Link></h2>
            </div>}           
        </>
    )
};

export default Page
