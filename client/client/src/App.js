import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import './App.css';
import 'stream-chat-react/dist/css/index.css';
import { ChannelContainer, ChannelListContainer, Auth } from './components';

const apiKey = '58kb45yfwpuk';
const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();
//! this token is been created at backend, refer Controller > Auth.js
// then it is been set in cookies after getting data from backend, refer components > Auth.js
const authToken = cookies.get("token");

// if auth token, this means we got data from backend
// create a user by getting information saved in cookies

if(authToken) {
  client.connectUser({
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      image: cookies.get('avatarURL'),
      hashedPassword: cookies.get('hashedPassword'),
      phoneNumber: cookies.get('phoneNumber'),
  }, authToken)
};

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth />

  return (
    <div className='app__wrapper'>
      <Chat client={client} theme="team light">
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />

        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType} />
      </Chat>
    </div>
  )
}

export default App