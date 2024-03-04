import React from 'react';
import { Channel, MessageSimple, useChatContext } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
   // console.log('I am in channel container, the right side window')
  // The specific channel we are in 
  const { channel } = useChatContext;

  // if user is creating a channel~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //! clicking + on UI trigger AddChannel component in TeamChannelList.js.
  //! App.js has ChannelListContainer has TeamChannelList has AddChannel, which is changing the 'isCreating'
  //! isCreating initially was false in App.js 
  if(isCreating){
    return(
      <div className= 'channel__container'>
        <CreateChannel createType={ createType }  setIsCreating= { setIsCreating } />
      </div>
    )
  }

  // if we are editing channel~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 if(isEditing){
    return(
      <div className= 'channel__container'>
        <EditChannel setIsEditing= { setIsEditing } />
      </div>
    );
  };
  
  // when user create a chat and there is no messages yet
  const EmptyState = () => (
    <div className='channel-empty__container'>
      <p className="channel-empty__first">This is the beginning of your chat history.</p>
      <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
    </div>
  );
  
  return (
    <div className='channel__container'>
       <Channel
          EmptyStateIndicator={EmptyState} // the actual message block space
          Message={(messageProps, i) => <MessageSimple key={i} {...messageProps} />} // able to see messages
        >
            <ChannelInner setIsEditing={ setIsEditing } /> 
         </Channel>
    </div>
  )
}

export default ChannelContainer;