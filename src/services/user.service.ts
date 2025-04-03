import axios from "axios";
import { User } from "../type/User";

const API_URL = "https://usermanager-nr91.onrender.com/api/user";

export const fetchUsers = async (page = 1, limit = 10, search = "") => {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                page, limit, search
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const fetchSingleUser = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data;
    }
    catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}


export const createUser = async (userData: Partial<User>) => {
    try {
        const response = await axios.post(API_URL, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUser = async (_id: string, userData: any) => {  
    try {
      const response = await axios.put(`${API_URL}/${_id}`, userData); 
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
  export const deleteUser = async (_id: string) => {  
    try {
      const response = await axios.delete(`${API_URL}/${_id}`); 
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }