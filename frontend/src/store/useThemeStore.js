
import { create } from 'zustand'

 export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stream-app")||'coffee',

  setTheme:(theme)=>{
    localStorage.setItem("stream-app",theme)
    set({theme})
  }
}))


