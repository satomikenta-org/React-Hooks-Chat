import React, { useState, useContext, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Grid, Container, Header, Loader, Button, Dimmer } from 'semantic-ui-react';
import { Notification} from 'element-react';
import axios from 'axios';
import baseURL from '../config/baseURL';
import AuthContext from '../contexts/authContext';
import CreateRoomComp from '../components/HomeComp/CreateRoomComp';
import SearchTopics from '../components/HomeComp/SearchTopics';
import TopicModal from '../components/HomeComp/TopicModal';
import ScrollTopics from '../components/HomeComp/ScrollTopics';

// maybe better to use useMemo to avoid rerender unneccesally.
const Home = () => {

	const {jwt, username, setUserStatus} = useContext(AuthContext);
	const [topics, setTopics] = useState(null);
	const [latestTopics, setLatestTopics] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [pressedBtnTitle, setPressedBtnTitle] = useState(null); 
	const [initialLoading, setInitialLoading] = useState(false);
	
	
	useEffect(() => {
		if (jwt === null || username === "") {
			setInitialLoading(true);
			setUserStatus();
		} 
		if (jwt !== null && username !== "") {
			getTopics('Latest Topics');
		}
	}, [jwt]);

	const getTopics = async category => {
		let url = "";
		switch(category) {
			case 'Topics You Created': url = `${baseURL}/topics/mytopics`; break;
			case 'Your Favorite Topics': url = `${baseURL}/topics/favorite`; break;
			case 'Latest Topics': url = `${baseURL}/topics/latest`; break;
			default: break; 
		}
		const data = await handleMakeRequest(url);
		if (data === "Error") {
			setInitialLoading(false);
			Notification({title: 'Error', message: 'Failed to Get Topics', type: 'error', duration: 2000});
			handleCloseModal();
		} else {
			if (category === 'Your Favorite Topics') {
				if (Object.keys(data).length !== 0) {
					if (data.Item.favorites) {
						setTopics(data.Item.favorites);
					} else {
						setTopics([]);
					}
				} else {
					setTopics([]);
				}
			} else if (category === "Latest Topics") {
				setLatestTopics(data.Items);
			} else {
				setTopics(data.Items);
			}
			setInitialLoading(false);
		}
	}; 

	const handleMakeRequest = async url => {
		try {
			const res = await axios.get(url, { 'headers': {'Authorization': jwt}});
			if (res.status === 500 || res.status === 401){
				return "Error";
			}
			return res.data; 
		} catch(err) {
			Notification({title: 'Error', message: 'Failed to Get Topics', type: 'error', duration: 2000});
			return "Error";
		}
	};

	const handleOpenModal = category => {
		setTopics(null);
		getTopics(category);
		setModalOpen(true);
		setPressedBtnTitle(category);
	};	

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			{ initialLoading ? (
			<Dimmer active inverted>
				<Loader size='large'></Loader>
			</Dimmer>): null }
			<div style={{ height: '60px', marginBottom: '20px'}}>
				<div style={{ top: '80px', left: '5px', position: 'absolute'}}>
					<Container fluid textAlign='center'>
						<Header as='h2' style={{ color: 'grey', textAlign: 'left'}}>Topics</Header>
					</Container>
				</div>
			</div>
			<div style={{ marginBottom: '3vh', marginTop: '6vh'}}>
				<SearchTopics jwt={jwt}/>
				<div style={{ marginTop: '5vh'}}>
					<ScrollTopics latestTopics={latestTopics}/>
				</div>
			</div>
			<div style={{ marginTop: '5px'}}>
				<Grid columns='two'>
					<Grid.Row>
						<Grid.Column style={{ display: 'flex', justifyContent: 'center'}}>
							<Button  onClick={() => handleOpenModal('Topics You Created')} circular content="Your's" style={{width: '28vw', height: '7vh'}}/>
						</Grid.Column>
						<Grid.Column style={{ display: 'flex', justifyContent: 'center'}}>
							<Button  onClick={() => handleOpenModal('Your Favorite Topics')} circular content="Favorite" style={{width: '28vw', height: '7vh'}}/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
			<TopicModal 
				title={pressedBtnTitle} 
				topics={topics} 
				handleOpenModal={handleOpenModal} 
				handleCloseModal={handleCloseModal} 
				modalOpen={modalOpen}
			/>
			<div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<CreateRoomComp/>
			</div>
		</>	
	);
};

export default withAuthenticator(Home);
 