import React from 'react';
import { Feed} from 'semantic-ui-react';
import moment from 'moment';
import Likes from './Likes';


const MsgFeed = props => {

  const calcAgo = timestamp => {
    const now = moment().unix();
    const ago = (now - timestamp) / 60;
    if (ago < 60) {
      return `${Math.round(ago)} minutes`
    } else if (ago < 1440) {
      return `${Math.round(ago / 60)} hours`
    } else {
      return `${Math.round(ago / 1440) } days`
    } 
  };

  const handleLikes = (msg_id, likes, timestamp) => {
    props.handleLikes(msg_id, likes, timestamp);
  };

  if (props.msgs.length === 0) {
    return (
      <div style={styles.feedContainer}>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <img src='https:icon.now.sh/android/f4b002' alt='android icon' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary >
              <Feed.User>Bot</Feed.User>
              <p style={styles.content}>No Content yet ...</p>
              <Feed.Date> 0 minutes ago</Feed.Date> 
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>   
      </Feed>
      </div>
    ) 
  } 
  return (
    <div style={styles.feedContainer}>
      <Feed>
        { props.msgs.map( (msg, i) => (
          <Feed.Event key={msg.timestamp}>
            <Feed.Label>
              <img src='https:icon.now.sh/insert_emoticon/f4b002' alt='human' />
              {/* avator here*/}
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary >
                <Feed.User>{msg.from}</Feed.User>
                <div style={{width: '70vw'}}>
                  <span style={styles.content}>{msg.content}</span>
                </div>
                <Feed.Date>{calcAgo(msg.timestamp)} ago</Feed.Date> 
              </Feed.Summary>
              <Feed.Meta >
              <Likes msg={msg} handleLikes={handleLikes}/>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        ))}    
      </Feed>
    </div>
  )
};

const styles = {
  feedContainer: {
    marginLeft: '5px'
  },
  content: {
    fontSize: '16px',
    textAlign: 'left'
  },
}
export default MsgFeed;