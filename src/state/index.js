import { createSlice } from "@reduxjs/toolkit";
const initialState={
    savedUsers:[]
}
export const userSlice = createSlice({
    name:"users",
    selectedUsersDomain:[],
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.savedUsers.push(action.payload);
        },
        removeUser:(state,action)=>{
            const newusers = state.savedUsers.filter(user=>user!==action.payload);
            state.savedUsers = newusers;
        },
        clearUsers:(state)=>{
            state.savedUsers = [];
        },
        setUser:(state,action)=>{
            state.savedUsers = action.payload;
        },
        setSelectedUsersDomainStore:(state,action)=>{
            state.selectedUsersDomain = action.payload;
        },



    }
})

export const {addUser,removeUser,clearUsers,setUser,setSelectedUsersDomainStore} = userSlice.actions;
export default userSlice.reducer;