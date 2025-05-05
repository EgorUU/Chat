'use client'
import '@/scss/chat.scss'
import { GoPaperclip } from "react-icons/go";
import { GoPaperAirplane } from "react-icons/go";
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { setAllRooms, setNewMessage, setRooms } from '@/store/reducers/CurrentRoomsReducer'
import { useSelector } from 'react-redux';
import { ICurrentAccount } from '@/types/user.interface';
import '@/scss/media.scss'
import { api_chat, api_db } from '@/variables/values';
import { IoMdSearch } from "react-icons/io";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
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

        newSocket?.on('load_history', async () => {
            
            
            
            
        })
        
        if (currentAccount?.name.length > 0) {
           UpdateRooms()
        }
    
        return () => {
            newSocket.off('create_message');
            newSocket.disconnect();
        };
    }, [])
    const UpdateRooms = async () => {
        const currName = currentAccount.name
        const res = await axios.post(api_db + '/show_rooms', {currName})
        dispatch(setAllRooms(res.data.rooms))
        console.log(rooms);
        
    }

    const linkMessage = useRef<HTMLDivElement | null>(null)
    const dispatch  = useDispatch();
    
    useEffect(() => {
        linkMessage?.current?.scrollIntoView();
    }, [messages])

    const inputMessage = useRef<HTMLInputElement | null>(null)

    const sendMessage = async () => {
        
        if (inputMessage?.current?.value != '') {
            const message: any = {text: inputMessage.current?.value, userId: currentAccount.id , room: currentRoom, userName: currentAccount.name ? currentAccount.name : "Неизвестный", time: `${new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours()}:${new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()}`}
            if (inputMessage.current) {
                inputMessage.current.value = '';
                inputMessage.current.blur()
            }
            
            await socket.emit('send_message', message)
            dispatch(setNewMessage<any>({currentRoom: currentRoom, message: message}))
            const interlocutorName = rooms.find((room: any) => room.id === currentRoom).participants.filter((name: string) => name !== currentAccount.name)[0]
            console.log(interlocutorName);
            
            try {
                
                console.log('succ');
                console.log({message: message, user: interlocutorName});
                
                const res = await axios.post(api_db + '/send-message', {message: message, user: message.userName})// Пока разбираемся с этим
                setTimeout(async () => {
                    if (res.data.succes) {
                        console.log('Успешно', message.userName);
                    
                        const res = await axios.post(api_db + '/send-message', {message: message, user: interlocutorName})
    
                    }
                }, 2000)
                
                
            } catch (err) {
                console.log('cwerr');
                
            }
            

            
            console.log(interlocutorName);
            
            // await axios.post(api_db + '/send-message', {message: message, user: })
            
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

    const rooms = useSelector((state: any) => state.currentRooms.rooms)

    const [currentRoom, setCurrentRoom] = useState<number>(0)
    const searchValue = useRef<any>(null)
    const [foundUsers, setFoundUsers] = useState<string[]>([])

    const updatePostMutation = useMutation<any>({
        mutationFn: async () => {
            const currName = currentAccount.name
            const response: any = await axios.post(api_db + '/show_rooms', {currName})
            return response.data;
        },
        onSuccess: (data) => {
            const messages: IMessage[] = data.rooms.find((room: any) => room.id === currentRoom).messages
            setMessages((prev: IMessage[]) => [...messages])
        },
        onError: (error) => {
        
        }
    })
    useEffect(() => {
        updatePostMutation.mutate()
    }, [currentRoom])

    const searchUsers = async () => {
        if (searchValue.current) {
            console.log(searchValue.current.value);
            const value = searchValue.current.value
            console.log(api_db + '/search-users');
            
            try {
                const res = await axios.post(api_db + '/search-users', {value: value})
                if (res.data) {
                    setFoundUsers([res.data.name])
                }
                else {
                    setFoundUsers([])
                }
                
            } catch (err) {
                console.error('Ошибка при поиске польователей')
            }
        }
    }

    return (
        <>
            {
                currentAccount.name.length > 0 ? (
                    <div className='messager-main' style={{height: `${useWindowHeight() - 56}px`}}>
                        <div className="messager">
                            <div className='messager__chat-background'>

                                <div className="rooms">
                                    <div className="rooms-search">
                                        <form action="">
                                            <input type="search" ref={searchValue} placeholder="Найдите собеседника начиная с @" onChange={(e) => {
                                                
                                            }}/>
                                            <IoMdSearch onClick={searchUsers}/>
                                        </form>
                                        {
                                            foundUsers.length > 0 && (
                                                <div className="found-users">
                                                    {
                                                        foundUsers.map((name: string, index: number) => (
                                                            <div className="found-users__name" key={index} onClick={async () => {
                                                                let hasUser = true
                                                                rooms.forEach((room: any) => {
                                                                    if (room.participants[0] === searchValue.current.value && room.participants[1] === currentAccount.name || room.participants[1] === searchValue.current.value && room.participants[0] === currentAccount.name) {
                                                                       alert('Чат с таким пользователем уже создан!')
                                                                       hasUser = false
                                                                       searchValue.current.value = ''
                                                                       searchUsers()
                                                                    }                                                            
                                                                })
                                                                if (hasUser) {                                                                
                                                                    const newName = name.slice(1, name.length)
                                                                    const myName = currentAccount.name
                                                                    const res = await axios.post(api_db + '/add_room', {newName, myName})
                                                                    UpdateRooms()
                                                                    searchValue.current.value = '';
                                                                    searchUsers()
                                                                }
                                                            }}>
                                                                <h1>{name}</h1>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                    {
                                        rooms.length > 0 && (
                                            <>
                                                {
                                                    rooms.map((room: any) => (
                                                        <div className={`room ${currentRoom === room.id ? "room-active" : ""}`} onClick={() => {            
                                                            socket.emit('join_room', {lastId: currentRoom, newId: room.id, newMessages: room.messages})
                                                            setCurrentRoom(room.id)
                                                        }}>
                                                            <h1>{room.participants.filter((name: string) => name != currentAccount.name)[0]}</h1>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        )
                                    }

                                </div>

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
                ) : <div className='welcome'>
                    <h1>Добро пожаловать в Chat!</h1>
                    <h2>Для общения <Link href="/login">Войдите</Link> в аккаунт, или <Link href="/register">Зарегистрируйтесь.</Link></h2>
                </div>    
            }       
        </>
    )
};

export default Page
