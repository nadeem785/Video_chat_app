import{Routes,Route, Navigate} from "react-router"
import React from 'react'
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import Onboarding from "./pages/OnboardingPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import { Toaster ,toast} from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import axios from 'axios'
import { axiosInstance } from "./lib/axios.js"
import PageLoader from "./components/PageLoader.jsx"
import { getAuthUser } from "./lib/api.js"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"
import {useThemeStore} from "./store/useThemeStore.js"



function App() {


const {isLoading,authUser}= useAuthUser()

const isAuthenticated= Boolean(authUser)
const isOnboarded= authUser?.isOnboarded


const {theme,setTheme}= useThemeStore()

if(isLoading){
  return <PageLoader></PageLoader>
}
  return (
    <div className=' h-screen' data-theme={theme}>
   <Routes>
<Route   path="/" element={isAuthenticated && isOnboarded ? (
  <Layout showSidebar={true}>

 <HomePage/>
  </Layout>
 
  
  ):(<Navigate to={!isAuthenticated?'/login':'/onboarding'} />)}/>
<Route   path="/signup" element={!isAuthenticated  ?<SignUpPage/>:<Navigate to={isOnboarded?'/':'/onboarding'}/>}/>
<Route   path="/login" element={!isAuthenticated ? <LoginPage/>:<Navigate to={isOnboarded?'/':'/onboarding'}/>}/>
<Route   path="/notifications"
 element={isAuthenticated && isOnboarded ? (
  <Layout showSidebar={true}>
    <NotificationPage/>
  </Layout>
 ):<Navigate to={!isAuthenticated?'/login':'/onboarding'} />}/>

<Route   path="/call/:id" element={isAuthenticated && isOnboarded?(
  <CallPage/>
):(<Navigate to={!isAuthenticated?"login":"/onboarding"}/>)}/>


<Route   path="/chat/:id" element= {isAuthenticated && isOnboarded?(<Layout showSidebar={false}>
  <ChatPage/>
</Layout>):(<Navigate to={!isAuthenticated?"login":"/onboarding"}/>)}/>


<Route   path="/onboarding" element={isAuthenticated ?(
!isOnboarded?<Onboarding />:<Navigate to='/' />
):<Navigate to='/login' />}/>
   </Routes>
   <Toaster/>
    </div>
  )
}

export default App