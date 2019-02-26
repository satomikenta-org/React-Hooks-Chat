import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Icon} from 'semantic-ui-react';
import { Carousel } from 'element-react';
import AuthContext from '../../contexts/authContext';

const ScrollTopics = props => {

  const { jwt, username } = useContext(AuthContext);
  const defaultTopics = [
    {topic_name: "No Topics yet..."},
    {topic_name: "No Topics yet..."}, 
    {topic_name: "No Topics yet..."}
  ];
  const goRoom = topic => {
    const room = topic.topic_name;
    const roomTimestamp = topic.timestamp;
    const roomCreator = topic.creator;
    props.history.push({
      pathname: '/chatroom', 
      state: {room, username, jwt, roomTimestamp, roomCreator }
    });
  };

  let topics;
  if (props.latestTopics !== null && props.latestTopics.length !== 0) {
    topics = props.latestTopics;
  } else {
    topics = defaultTopics;
  }
  return (
    <Container fluid textAlign='center' style={{ marginLeft: '5vw', marginRight: '5vw'}}>
      <h2 style={{color: 'grey'}}><Icon name="clock outline"/>Latest Topics<p style={{fontSize: '13px'}}>created in 24hours</p></h2>         <Carousel interval="3000" type="card" height="15vh" indicatorPosition="none" arrow="always">
        {
          topics.map((topic, i) => {
            return (
              <div onClick={ () => goRoom(topic) } key={i}>
                <Carousel.Item>
                  <div style={styles.carouselItemScreen}>
                    <Icon name="comments outline" size="large" color="yellow"/>
                    <div style={{ width: '40vw'}}> 
                      <span style={{fontSize: '20px', color: '#e1e6ea'}}>{topic.topic_name}</span>
                    </div>
                  </div>
                </Carousel.Item>
              </div>
            )
          })
        }
      </Carousel>
    </Container>
  )
}



const styles = {
  carouselItemScreen: {
    height: '14vh', 
    backgroundColor: '#31465F', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-around', 
    alignItems: 'center'
  }
}

export default withRouter(ScrollTopics);