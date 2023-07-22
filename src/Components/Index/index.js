import React from "react";
import { useSelector } from "react-redux";
import Home from "../../Screens/Home";
import Login from "../../Screens/Login";

const Index = () => {
    const isLoggedIn = useSelector ((state) =>  state.auth.isLoggedIn)
    return( 
        <div>
            {isLoggedIn ?  <Home/> : <Login/>}
        </div>
    )
}

export default Index