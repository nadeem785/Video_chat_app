
import React from 'react'
import { getAuthUser } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
function useAuthUser() {
    const authUser= useQuery({
        queryKey:["authUser"],
        queryFn:getAuthUser,
        retry:false
      })
      return {isLoading:authUser.isLoading,authUser:authUser.data?.user}
}

export default useAuthUser