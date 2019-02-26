import React, { useState, useContext, useEffect } from 'react';
import { Icon , Input, Modal, Divider} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import baseURL from '../../config/baseURL';
import AuthContext from '../../contexts/authContext';
import { Button as EleButton, Notification } from 'element-react';


const CreateRoomComp = (props) => {
  const { jwt, username } = useContext(AuthContext);
  const [open, setOpen ] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect( () => {
    if (jwt == null) {
      return;  
    }
  }, [jwt]);

  const show = () => {
    setOpen(true);
  };

  const handleCreateAndClose = async () => {
    if (topicName === "") {
      Notification({title: 'Invalid',message: 'You Must Provide Name',type: 'warning',duration: 3000});
      return;
    }
    setIsLoading(true);
    const data = {topicName: topicName, timestamp: moment().unix()};
    try {
      const res = await axios.post(`${baseURL}/topics`, data, {"headers": {'Authorization': jwt}});
      if (res.data.msg === "Already Exists") {
        Notification({title: 'Warning',message: `${topicName}, Already Exists`,type: 'warning',duration: 2000});
      } else if (res.status === 500) {
        Notification({title: 'Error',message: `Failed to Create Room. Try Again`,type: 'error',duration: 2000});
      } else {
        setOpen(false);
        const room = topicName;
        const roomTimestamp = res.data.item.timestamp;
        const roomCreator = res.data.item.creator;
        props.history.push({
          pathname: '/chatroom', 
          state: {room, username, jwt, roomTimestamp, roomCreator }
        });
      }
      setTopicName("");
      setIsLoading(false);
    } catch(err) {
      Notification({title: 'Error',message: 'Failed to Create Room. Try Again',type: 'error',duration: 2000});
      setIsLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setTopicName(e.target.value);
  }; 
  const close = () => {
    setOpen(false);
  };
  
  return (
    <div>
      <EleButton type="warning" plain={true} onClick={show} icon="edit">Create Topic</EleButton>
      <Modal open={open} onClose={close} size="tiny">
        <Modal.Header style={{ color: 'grey', fontSize: '16px'}}>Create a Room</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Input size="huge" value={topicName} icon={<Icon name='pencil' circular link />} placeholder='Room Title' onChange={handleOnChange}/>
            <p></p>
            <p style={{ color: 'grey', fontSize: '16px'}}>Is it okay to create this Room?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <EleButton onClick={close} >No</EleButton>
          <EleButton type="warning" loading={isLoading} onClick={handleCreateAndClose}>Yes</EleButton>
          <Divider/>
        </Modal.Actions>
      </Modal>
    </div>
  )
};

export default withRouter(CreateRoomComp);