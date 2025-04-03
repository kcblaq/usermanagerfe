import { useMutation, useQuery, useQueryClient,  } from "@tanstack/react-query";
import { createUser, deleteUser, fetchUsers, updateUser } from "../services/user.service";
import { fetchSingleUser } from "../services/user.service";
import { ResponseData, User } from "../type/User";


export const useUsers = (page: number, limit: number, search: string) => {
  return useQuery<ResponseData, Error>({
    queryKey: ["users", page, limit, search],
    queryFn: () => fetchUsers(page, limit, search),
  });
};

export const useSingleUser = (id: string) => {
    return useQuery<User, Error>({
        queryKey: ["user", id],
        queryFn: () => fetchSingleUser(id),
        enabled: !!id, 
    });
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, User>({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};


// Update your hook to use _id consistently:
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, { _id: string; userData: User }>({
    mutationFn: ({ _id, userData }) => updateUser(_id, userData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables._id] });
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (_id) => deleteUser(_id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user', id] });
    },
  });
};