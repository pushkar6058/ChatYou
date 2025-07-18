import React,{lazy, Suspense} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'

import { LayoutLoader } from './components/layout/Loader'

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


  let user=true;

  return (
    <>
    <BrowserRouter>
       
       <Suspense fallback={<LayoutLoader/>}>
        <Routes>
        <Route  path='/login' element={<ProtectRoute user={!user} redirect='/'>
          <Login/>
        </ProtectRoute>}/>

        
        <Route element={<ProtectRoute user={user}/>}>
          <Route  path='/' element={<Home/>}/>
          <Route  path='/groups' element={<Groups/>}/>
          <Route  path='/chat/:chatId' element={<Chat/>}/>
        </Route>

        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/users' element={<UserManagment/>}/>
        <Route path='/admin/chats' element={<ChatManagment/>}/>
        <Route path='/admin/messages' element={<MessageManagment/>}/>
        

        <Route path='*' element={<NotFound/>}/>
        
       </Routes>
       </Suspense>
    
    </BrowserRouter>
    
    </>
  )
}

export default App