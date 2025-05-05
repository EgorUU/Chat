// src/store/reducers/loginReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IRooms {
    participants: string[],
    id: number,
    type: string,
    messages: any
}

interface I {
    rooms : IRooms[]
}

const initialState: I = {
  rooms: [
    
  ]
};

const currentRoomsReducer = createSlice({
  name: 'currentRooms',
  initialState,
  reducers: {
    setAllRooms: (state: any, action: PayloadAction) => {
        state.rooms = action.payload
    },
    setRooms: (state: any, action: PayloadAction) => {
      state.rooms = [...state.rooms, action.payload]
    },
    setNewMessage: (state: any, action: any) => {
      const currRoom = action.payload.currentRoom
      const newMessage = action.payload.message
      state.rooms[state.rooms.findIndex((room: any) => room.id === currRoom)].messages = [...state.rooms[state.rooms.findIndex((room: any) => room.id === currRoom)].messages, newMessage] 
    }
  }
});

// Правильный экспорт:
export default currentRoomsReducer.reducer; // Дефолтный экспорт редюсера
export const { setRooms, setAllRooms, setNewMessage } = currentRoomsReducer.actions; // Именованный экспорт экшенов