import React,{lazy, Suspense, useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import axios from "axios"
import { LayoutLoader } from './components/layout/Loader'
import { server } from './constants/config';
import {useDispatch, useSelector} from "react-redux";
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './socket'

const Home= lazy(()=>import("./pages/Home"))
const Login= lazy(()=>import("./pages/Login"))
const Groups= lazy(()=>import("./pages/Groups"))
const Chat= lazy(()=>import("./pages/Chat"))
const NotFound=lazy(()=>import("./pages/NotFound"));
const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin"))
const AdminDashboard=lazy(()=>import("./pages/admin/AdminDashboard"))
const UserManagment=lazy(()=>import("./pages/admin/UserManagment"))
const ChatManagment=lazy(()=>import("./pages/admin/ChatManagment"))
const MessageManagment=lazy(()=>import("./pages/admin/MessageManagment"))



const App = () => {

  const {user,loader}=useSelector(state=>state.auth);

  const dispatch=useDispatch();

useEffect(()=>{
 
  axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
  .then(({data})=>
    dispatch(userExists(data.user))
  )
  .catch(err=>dispatch(userNotExists()));
  
},[dispatch]);
  
  return loader  ? <LayoutLoader/> :(
    <>
    <BrowserRouter>
  <Suspense fallback={<LayoutLoader />}>
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <ProtectRoute user={!user} redirect="/">
            <Login />
          </ProtectRoute>
        }
      />

      {/* ✅ User Routes with SocketProvider */}
      <Route
        element={
          <SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Route>

      {/* 🚫 Admin Routes (No socket access) */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagment />} />
      <Route path="/admin/chats" element={<ChatManagment />} />
      <Route path="/admin/messages" element={<MessageManagment />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>

  <Toaster />
</BrowserRouter>

    
    </>
  )
}

export default App