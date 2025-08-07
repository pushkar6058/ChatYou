import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";

const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [api.reducerPath]:api.reducer,
        [chatSlice.reducerPath]:chatSlice.reducer,
    },
    middleware:(mid)=>[...mid(),api.middleware]
});

export default store;