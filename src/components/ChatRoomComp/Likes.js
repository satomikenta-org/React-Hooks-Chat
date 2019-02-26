import React, { useState, useContext } from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import { Notification } from 'element-react';
import AuthContext from '../../contexts/authContext';

const Likes = (props) => {
  const {username} = useContext(AuthContext);
  const { msg } = props;
  const [ likes, setLikes ] = useState(msg.likes);
  const [ alreadyLiked, setAlreadyLiked] = useState(false);
  
  const handleLikes = () => {
    if ( msg.from === username){
      return;
    } else if (alreadyLiked) {
      Notification({title: 'Opps!', message: 'You already Liked !!', type: 'error', duration: 1200});
      return;
    } else {
      props.handleLikes(msg.msg_id, msg.likes, msg.timestamp, msg.from);
      setLikes(prevState => prevState + 1);
      setAlreadyLiked(true);
    }
  };

  return (
    <Feed.Like onClick={handleLikes}>
      <Icon name='like'/>
      {`${likes} Likes`}
    </Feed.Like>
  ); 
};

export default Likes;
