import React, { Component } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import AuthContext from './contexts/authContext';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

class App extends Component  {
  constructor (props) {
    super(props);
    this.state = {
      authState: 'loading',
      jwt: null,
      username: ""
    };
    this.onHubCapsule = this.onHubCapsule.bind(this);
    this.setUserStatus = this.setUserStatus.bind(this);
    Hub.listen('auth', this);
  }; 

  componentDidMount() {
    this.setUserStatus();
  };
  
  setUserStatus() {
    Auth.currentAuthenticatedUser()
    .then( user => {
      if (user) {
        this.setState({ authState: "signedIn", username: user.username});
        this.getJWT();
      } else {
        this.setState({ isAuth : "signIn"});
      }
    })
    .catch( err => console.log("currentauth error", err));
  };

  onHubCapsule(capsule) {
    const { channel, payload, source } = capsule;
    if (channel === 'auth') {
      switch (payload.event) {
        case 'signIn':
          this.setState({authState: 'signedIn'}); break;
        case 'signIn_failure':
          this.setState({authState: 'signIn'}); break;
        default: break;
      }
    }
  };

  signOut = () => {
    return new Promise( (resolve, reject) => {
      Auth.signOut({ global: true })
      .then(() => {
        this.setState({authState: 'signIn', jwt: null, username: "" });
        resolve();
      })
      .catch( err => reject(err));
    })
  };

  getJWT = () => {
    Auth.currentSession()
    .then(data => this.setState({jwt: data.idToken.jwtToken}))
    .catch(err => console.log(err));
  };

  render () {
    const { authState, jwt, username} = this.state;
    const { signOut, setUserStatus } = this;
    return (
      <AuthContext.Provider value={{isAuth: authState, signOut, setUserStatus, jwt, username}}>
        <BrowserRouter>
          <>
            <NavBar/>
            <Switch>
              {/* <Route exact path="/" component={Welcome}/> */}
              <Route exact path="/" component={Home}/>
              {/* <Route path="/login" component={Login}/> */}
              <Route path="/chatroom" component={ChatRoom}/>
            </Switch>
          </>
        </BrowserRouter>
      </AuthContext.Provider>
    );
  }
}

export default App;
