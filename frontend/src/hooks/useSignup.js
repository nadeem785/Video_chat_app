
import React from 'react'
import { useQueryClient,useMutation } from '@tanstack/react-query'
import { signup } from '../lib/api'
function useSignup() {
  const queryClient= useQueryClient()
 const  {mutate, isPending,error}   =useMutation({
  mutationFn:signup,
  onSuccess:()=> queryClient.invalidateQueries({queryKey:["authUser"]})
 })

return {signupMutation:mutate,isPending,error}
}

export default useSignup