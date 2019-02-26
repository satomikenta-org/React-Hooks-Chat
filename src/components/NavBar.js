import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Notification, Menu } from 'element-react';
import { Icon } from 'semantic-ui-react';
import Button from '@material-ui/core/Button';
import AuthContext from '../contexts/authContext';

 
const NavBar = props => { 
  const authContext = useContext(AuthContext); 
  const handleLogout = () => {
    authContext.signOut()
    .then( () => props.history.replace('/'))
    .catch( err =>  {
      Notification({
        title: 'Oops',
        message: 'Failed to SignOut.. ',
        type: 'error',
        duration: 1200
      })
    });
  };

  return (
    <Menu theme="dark" className="el-menu-demo" mode="horizontal">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
        <div onClick={() => props.history.push('/')} style={{marginLeft: '10px'}}>
          <h3 style={{ color: 'white'}}><Icon name="certificate" color="orange" size="small"/>Community Chats</h3>
        </div>
      <div>
        <Menu.Item index="2">
        { authContext.isAuth === "signedIn" ? (<Button color="inherit" onClick={handleLogout}>Logout</Button>)
        : (<Button color="inherit" onClick={() => props.history.push('/')}>Login/Signup</Button>)}
        </Menu.Item>
      </div>
      </div>
    </Menu>
  )
}
export default withRouter(NavBar);