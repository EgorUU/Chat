'use client'
import '@/scss/chat.scss'
import { GoPaperclip } from "react-icons/go";
import { GoPaperAirplane } from "react-icons/go";
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any>([])
    const [socket, setSocket] = useState<any>(null);
    const [room, setRoom] = useState<any>(null)
    const newSocket: any = io('http://localhost:5600', {
        withCredentials: true,
        transports: ['websocket', 'polling']
    });
    useEffect(() => {
        const newSocket: any = io('http://localhost:5600', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        setSocket(newSocket)

        newSocket.on('connect', () => {
            
        });


        newSocket.on('connect_error', (err: any) => {
            console.error('Ошибка подключения:', err.message);
        });

        newSocket?.on('create_message', (data: any) => {
            
            
            setMessages((prev: any)=> [...prev, data])
        }, [])
        newSocket?.on('load_history', (messagesArray: any) => {
            
            setMessages((prev: any) => [...prev, ...messagesArray])
            
            
        })

        return () => {
            newSocket.off('create_message');
            newSocket.disconnect();
        };
    }, [])
    const linkMessage = useRef<any>(null)
    useEffect(() => {
        
        
        linkMessage?.current?.scrollIntoView();
    }, [messages])

    const [friends, setFriends] = useState<any>([
        
    ])


    const sendMessage = async () => {
        
        await socket.emit('send_message', {text: inputMessage.current?.value, userId: currentAccount.id , userName: currentAccount.name ? currentAccount.name : "Неизвестный", time: `${new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours()}:${new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()}`})
        inputMessage.current.value = ''
        inputMessage.current.blur()
    }

    const inputMessage = useRef<any>(null)
    const currentAccount: any = useSelector((state: any) => state.currentAccount);
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
    const [currentRoom, setCurrentRoom] = useState<number | null>(null)
    return (
        <>
            {currentAccount.name.length > 0 ? (
                <div className='messager-main'>
                <div className="messager">
                    <div className='messager__chat-background'>
                        <div className="messager__chat">
                            <div className="messager__chat-messages" >
                                {
                                    messages.map((message: any, index: number) => (
                                        
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
                                <div className='send' title='Отправить' onClick={sendMessage}>
                                    <GoPaperAirplane/>
                                </div>
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

export default Chat
