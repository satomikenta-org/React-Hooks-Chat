import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Loader, Dimmer, List, Divider } from 'semantic-ui-react';
import AuthContext from '../../contexts/authContext';

const TopicList = (props) => {

  const { username, jwt } = useContext(AuthContext);
  
  const handleEnter = topic => {
    props.handleCloseModal();
    const { topic_name, timestamp, creator} = topic;
    props.history.push({
      pathname: '/chatroom', 
      state: {room: topic_name, timestamp, creator, username, jwt}
    });
  };
  
  if (props.topics !== null && props.topics !== undefined) {
    return (
      <List divided relaxed>
        { props.topics.map( topic => (
          <List.Item key={topic.topic_name}>
            <List.Content onClick={() =>handleEnter(topic)}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center'}}>
                <div>
                  <List.Header as='a' style={{fontSize:'18px'}}>{topic.topic_name}</List.Header>
                </div>
              </div>
            </List.Content>
            <Divider/>
          </List.Item>
        ))}
      </List>
    )
  } 
  return  <Dimmer active inverted><Loader size='large'></Loader></Dimmer>
};

export default withRouter(TopicList);