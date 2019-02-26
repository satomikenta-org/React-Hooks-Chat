import React from 'react';

const authContext = React.createContext({isAuth: false, signOut: function(){}, jwt: "", username: ""});
export default authContext;