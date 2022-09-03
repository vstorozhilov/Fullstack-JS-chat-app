import React from "react";

const authentificationContext = React.createContext({
    user: {},
    setUser: (newuser)=>{this.user = newuser}
});

export default authentificationContext;