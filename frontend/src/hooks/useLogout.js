
import { logout } from "../lib/api"
import { useQueryClient,useMutation } from '@tanstack/react-query';


function useLogout(){
    const queryClient= useQueryClient()
    const {mutate}  =useMutation({
        mutationFn:logout,
        onSuccess:()=>queryClient.invalidateQueries({queryKey:['authUser']})
    })
    return {logoutMutation:mutate}

}

export default useLogout