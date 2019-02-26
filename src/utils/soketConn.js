import io from 'socket.io-client';
import baseSocketURL from '../config/baseSocketURL';

const socket = io.connect(baseSocketURL);

export default socket;