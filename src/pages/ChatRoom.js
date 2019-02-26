import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import moment from 'moment';
import axios from 'axios';
import { Notification, Button as EleButton } from 'element-react';
import { Button, Divider, Container, Header, Dimmer, Loader, Icon} from 'semantic-ui-react';
import socket from '../utils/soketConn';
import baseURL from '../config/baseURL';
import MsgInput from '../components/ChatRoomComp/MsgInput';
import MsgFeed from '../components/ChatRoomComp/MsgFeed';


class ChatRoom extends Component {
  state = {
    msgs: [],
    room: this.props.location.state.room,
    roomTimestamp: this.props.location.state.timestamp,
    roomCreator: this.props.location.state.creator, 
    username: this.props.location.state.username,
    jwt: this.props.location.state.jwt,
    showUserModal: false,
    isLoading: true,
    startTimestamp: 0,
    msg_id: "",
    isLoadingForMore: false,
    remainPage: true,
  };

  
  componentDidMount() {
    const userData = {roomName: this.state.room, jwt: this.state.jwt, username: this.state.username};
    this.handleGetMsgs();
    socket.open(); 
    socket.emit('room', userData);
    socket.on(this.state.room, (data) => {
      this.setState({msgs: [data, ...this.state.msgs]});
      if (data.from !== this.state.username){
        Notification({title: '', message: 'New Message !', type: 'info', duration: 1500});
      }
    });
  };

  componentWillUnmount() {
    socket.disconnect();
  };
  
  handleGetMsgs = async () => {
    const { jwt, msgs } = this.state;
    const url = `${baseURL}/messages/${this.state.room}`;
    try {
      const res = await axios.get(url, { headers: { 'Authorization': jwt}});
      if (res.status === 500){
        this.setState({isLoading: false});
        Notification({title: 'Error',message: 'Failed to Load Data',type: 'error',duration: 2000});
      } else {
        const { Items, LastEvaluatedKey } = res.data;
        if (LastEvaluatedKey) {
          const msg_id = LastEvaluatedKey.msg_id;
          this.setState({msgs: Items, isLoading: false, startTimestamp: LastEvaluatedKey.timestamp, msg_id});
        } else {
          const newMsgs = [...msgs, ...Items];
          this.setState({msgs: newMsgs, isLoading: false, remainPage: false});
        }
      }
    } catch(err) {
      Notification({title: 'Error', message: 'Failed to Load Data', type: 'error', duration: 2000});
      this.setState({isLoading: false});
    }
  };

  handlePagination = async () => {
    this.setState({ isLoadingForMore: true });
    const { msgs, room, jwt, startTimestamp, msg_id} = this.state;
    try {
      const url = `${baseURL}/messages/${room}?start=${startTimestamp}&msg_id=${msg_id}`;
      const res = await axios.get(url, {headers: {'Authorization': jwt}});
      if (res.status !== 500){
        const { LastEvaluatedKey, Items } = res.data;
        if (LastEvaluatedKey) {
          const startTimestamp = LastEvaluatedKey.timestamp;
          const msg_id = LastEvaluatedKey.msg_id; 
          const newMsgs = [...msgs, ...Items];
          this.setState({msgs: newMsgs, isLoadingForMore: false, startTimestamp, msg_id});
        } else {
          const newMsgs = [...msgs, ...Items];
          this.setState({msgs: newMsgs, isLoadingForMore: false, remainPage: false});
        } 
      } else {
        Notification({title: 'Error', message: 'Failed to Load Messages', type: 'error', duration: 2000});
        this.setState({isLoadingForMore: false});
      }      
    } catch(err) {
      Notification({title: 'Error', message: 'Failed to Load Messages', type: 'error', duration: 2000});
      this.setState({isLoading: false});
    }
  };
  
  handlePosting = async content => {
    const timestamp = moment().unix();
    const from = this.props.location.state.username; 
    const msg = {content, timestamp, from, likes: 0, roomName: this.state.room};
    const data = {content, from, roomName: this.state.room};
    const headers = {'Authorization': this.state.jwt};
    try {
      const res = await axios.post(`${baseURL}/messages`, data, {"headers" : headers});
      if (res.status === 200){
        socket.emit('msgFromClient', msg); 
      } else {
        Notification({title: 'Error', message: 'Failed to Send Message', type: 'error', duration: 2000});
      }
    } catch(err) {
      Notification({title: 'Error', message: 'Failed to Send Message', type: 'error', duration: 2000});
    }
  };

  handleLikes = async (msg_id, likes, timestamp) => {
    const { room, jwt } = this.state;
    const data = {room, msg_id, likes, timestamp};
    const url = `${baseURL}/messages/likes`;
    try {
      const res = await axios.post(url, data, {headers: {"Authorization": jwt}});
      if (res.status === 200) {
        return;
      }
      Notification({title: 'Error', message: 'Failed to Save Your likes', type: 'error', duration: 1600});
    } catch(err) {
      Notification({title: 'Error', message: 'Failed to Save Your likes',type: 'error', duration: 1600});
    }
  };

  handleGoHome = () => {
    this.props.history.push('/');
  };

  handleFavorite = async () => {
    const { room, roomTimestamp, roomCreator, jwt } = this.state;
    const url = `${baseURL}/topics/favorite`;
    const data = {topicName: room,roomTimestamp,roomCreator};
    const headers = {'Authorization': jwt};
    try {
      const res = await axios.post(url, data, {headers});
      if (res.data.msg === 'Already in Favorites') {
        Notification({title: '', message: 'Already in Favorites', type: 'warning', duration: 1600})
      } else if (res.data.msg !== "Already in Favorites"){
        Notification({title: 'Success', message: 'Save to Your Favorites',type: 'info', duration: 1600})
      } else {
        Notification({title: 'Error', message: 'Failed to Save Favorite', type: 'error', duration: 1600});
      }
    } catch(err) {
      Notification({title: 'Error', message: 'Failed to Save Favorite', type: 'error', duration: 1600});
    }
  };

  render() {
    const { handleLikes, handlePosting, handlePagination, handleGoHome, handleFavorite } = this;
    const { isLoading, msgs, isLoadingForMore, remainPage} = this.state;
    return (
      <>
        <div style={{ marginTop: '30px', marginLeft: '10px'}}>
          <Button icon onClick={handleGoHome} style={{width: '100px'}}>
            <Icon name='reply'/>Back
          </Button>
          <Button icon onClick={handleFavorite} color='yellow' style={{width: '100px'}}>
            <Icon name='thumbtack'/>Favorite
          </Button>
        </div>
        <Container fluid textAlign='center'>
          { isLoading ? (
            <Dimmer active inverted>
                <Loader  size="massive"></Loader>
            </Dimmer>): null
          }
          <Divider/>
          <Header as='h3' style={{ color: 'grey'}}>{this.props.location.state.room}</Header>
          <Divider/>
          <MsgInput handlePosting={handlePosting}/>
          <MsgFeed  msgs={msgs} handleLikes={handleLikes}/>
          <Divider horizontal/>
          { remainPage ? <EleButton onClick={handlePagination} loading={isLoadingForMore}>Load More</EleButton>: null}
          <Divider />
          { msgs.length > 6 ? <Button color="blue" onClick={() => window.scrollTo(0, 0)}>Go to Top</Button>: null}
          <Divider/>
        </Container>
      </>
    )
  }
};

export default withAuthenticator(ChatRoom);