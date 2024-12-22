import {createAsyncThunk,createslice} from '@reduxjs/toolkit';
import toast from 'react-hot-toast'
import axios from 'axios'
const initialState = {
   isLoggedin : localStorage.getItem('isLoggedin') || false,
   data : localStorage.getItem('data') || {}, 
}

export const createAccount = createAsyncThunk("/auth/signup", async(data) => {
    try {
        const response = await axios.post("http://localhost:5000/auth/signup", data);
        toast.promise(response,{
            loading : 'Creating Account...',
            success : (res) => {
                return res.data.message || 'Account created successfully'
            },
            error : 'An error occured while creating account'
        })
        return response.data
    } catch (error) {
        toast.error(error.response.data.message || 'An error occured while creating account')
    }
})

const authSlice = createslice({
    name : 'auth',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(createAccount.fulfilled, (state,action) => {
            return action.payload
        })
    }
})

// export const {} = authSlice.actions
export default authSlice.reducer
