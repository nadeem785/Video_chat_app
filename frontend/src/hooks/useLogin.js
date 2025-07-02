
import React from 'react'
import { login } from '../lib/api';
import { useQueryClient,useMutation } from '@tanstack/react-query';
function useLogin() {
 const queryclient= useQueryClient()
const{mutate ,isPending,error}=useMutation(
  {
    mutationFn:login,
    onSuccess:()=>queryclient.invalidateQueries({queryKey:["authUser"]})
  }
);
return {error,isPending,loginMutation:mutate}
}

export default useLogin