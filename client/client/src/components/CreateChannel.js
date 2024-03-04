import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
   const handleChange = (e) => {
     e.preventDefault();
     setChannelName(e.target.value)
   };

    return(
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input 
                type='text'
                placeholder='channel-name'
                value = {channelName}
                onChange={ handleChange }
            />
            <p>Add Members </p>
        </div>
    )
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [ selectedUsers, setSelectedUserList ] = useState([ client.userID || '' ]);
  const [channelName, setChannelName] = useState('');
 // console.log(' In create channel', selectedUsers)

  const createChannel = async(e) => {
    e.preventDefault();

    try {
        const newChannel = await client.channel( createType, channelName, {
            name: channelName, members: selectedUsers
        });
        console.log('creating a new channel ~~',newChannel)
        await newChannel.watch(); // keep watching the channel if there is a new message

        setChannelName('');
        setIsCreating(false); // since we have just created one
        setSelectedUserList([ client.userID ]); // by default in any channel you are added always
        setActiveChannel(newChannel);

    } catch(error){
        console.log(error);
    }
  }
  return (
    <div className="create-channel__container">
        <div className="create-channel__header">
            <p>
                {createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}
            </p>
        </div>
                {/* <CloseCreateChannel setIsCreating={setIsCreating} /> */}
        { createType === 'team' && 
            <ChannelNameInput channelName={ channelName } setChannelName={ setChannelName }/>
        }
        <UserList setSelectedUserList={ setSelectedUserList } />
        <div className='create-channel__button-wrapper' onClick={ createChannel }>
            <p>{ createType === 'team' ? 'Create Channel' : 'Create Message Group' }</p>
        </div>
    </div>
  );
};

export default CreateChannel