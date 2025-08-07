import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../libs/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount:0,
  newMessageAlert: getOrSaveFromStorage({
    key:NEW_MESSAGE_ALERT,
    get:true
  }
  ) ||[
    {
      chatId: "",
      count: 0,
    }
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    incrementNotification:(state)=>{
      state.notificationCount+=1;
    },
    resetNotification:(state)=>{
      state.notificationCount=0;
    },

    setNewMessageAlert:(state,action)=>{

      const chatId=action.payload.chatId;
      const idx=state.newMessageAlert.findIndex((item)=>item.chatId===chatId);

      if(idx !==-1){
        state.newMessageAlert[idx].count+=1;

      }

      else{
        state.newMessageAlert.push({
          chatId,
          count:1,
        })
      }
    },

    removeNewMessagesAlert:(state,action)=>{
      state.newMessageAlert=state.newMessageAlert.filter((item)=>item.chatId!==action.payload);
    }

  }
});

export default chatSlice;
export const {
  incrementNotification,
  resetNotification,
  setNewMessageAlert,
  removeNewMessagesAlert
  
} = chatSlice.actions;
