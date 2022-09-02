import React from "react";

const authentificationContext = React.createContext({
    user: {},
    setUser: ()=>{}
});

export default authentificationContext;