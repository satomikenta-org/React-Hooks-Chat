import React from 'react';
import { Divider, Modal, Dimmer, Loader, Icon } from 'semantic-ui-react';
import { Button as EleButton} from 'element-react';
import TopicList from './TopicList';

const TopicModal = props => {
  let iconName = ""; 
  if (props.title === "Topics You Created") {
    iconName = "copyright outline"
  } else if (props.title === "Your Favorite Topics"){
    iconName = "tags"
  } else {
    iconName = "hourglass half"
  };

  return (
    <>
      <div style={{marginTop: '80px'}}>
      { props.topics === null ? (
      <Dimmer>
        <Loader/>
      </Dimmer>): null
      }
      <Modal open={props.modalOpen} close={props.handleModalClose}>
        <div style={{ marginTop: '10px' ,display:'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h3 style={{ color: 'grey'}}><Icon color='orange' name={`${iconName}`}/> {props.title}</h3>
        </div>
        <Modal.Content scrolling>
          <Modal.Description>
            <TopicList setModalOpen={props.handleOpenModal} handleCloseModal={props.handleCloseModal} topics={props.topics}/> 
          </Modal.Description>
        </Modal.Content>
        <Divider/>
        <div style={{ margin: '5px'}}><EleButton onClick={props.handleCloseModal}>Back</EleButton></div>
      </Modal>
      </div>
    </>
  )
};

export default TopicModal;