import React, { useState　} from 'react';
import axios from 'axios';
import { Container, Input, Icon, Modal, Button, Form } from 'semantic-ui-react';
import TopicList from './TopicList';
import baseURL from '../../config/baseURL';


const SearchTopics = props => {

  const [searchResults, setSearchResults] = useState([]);
	const [searchWord, setSearchWord] = useState("");
  const [isPressed, setisPressed] = useState(false);
  const [open, setOpen] = useState(false);
  const [noHit, setNoHit] = useState(false);
  const handleSearchRequest = async () => {
		const url = `${baseURL}/topics?searchword=${searchWord}`;
		try {
			const res = await axios.get(url, {headers: {"Authorization": props.jwt}});
			if (res.status === 200) {
        const items = res.data.data.Items;
        setSearchResults(items);
        setisPressed(false);
        if (res.data.data.Count > 0){
          setOpen(true);
        } else {
          setNoHit(true);
        } 
        setSearchWord("");
			} else {
        setisPressed(false);
				return;
			}
		} catch(err) {
      setisPressed(false);
			return;
		}
  };

  const handleOnChange = e => {
    setNoHit(false);
    setSearchWord(e.target.value);
  };

  const handleOnClick = () => {
    setisPressed(true);
    handleSearchRequest();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  
  let searchIcon = null; 
  if (searchWord === ""){
    searchIcon = (<Icon disabled name='search' size="large"/>);
  } else if (searchWord !== "" && isPressed === false) {
    searchIcon = (<Icon name='search' color='blue' size="big" onClick={handleOnClick}/>)
  } else {
    searchIcon = (<Icon loading name='search' size="large"/>)
  }
  return (
    
      <Container fluid textAlign='center'>
        <Form onSubmit={handleOnClick} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Input placeholder='Search...' value={searchWord} style={{width: '70vw', marginRight: '5px'}} onChange={handleOnChange}/>
          {searchIcon}
        </Form> 
      <Modal open={open}>
        <Modal.Header>
          <span style={{color: 'grey', fontSize: '20px'}}>Search Results:</span>
          <span style={{ color: 'grey', marginLeft: '10px',fontSize: '16px'}}>{`${searchResults.length} Hits`}</span>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <TopicList handleCloseModal={handleCloseModal} topics={searchResults}/>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="yellow" onClick={()=> setOpen(false)}>
            Cancel <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>  
      { noHit ? (
      <div style={{marginTop: '10px'}}>
        <span style={{color: 'grey', fontSize: '17px'}}>
          <Icon onClick={() => setNoHit(false)}name="times circle"/>Sorry No Hit..
        </span>
      </div>): null}
    </Container>
  )
};

export default SearchTopics;