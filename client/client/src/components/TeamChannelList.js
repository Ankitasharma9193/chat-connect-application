import React, { Children } from 'react';
import { AddChannel } from '../assets';

const TeamChannelList = ({ setToggleContainer, children, error = true, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing }) => { // type - is it group chat or personal message
   // console.log(type)
    if(error){
        return type === 'team' ? (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    Connection error, please wait a moment and try again.
                </p>
            </div>
        ) : null
    }

    if(loading){
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message loading'>
                    { type === 'team' ? 'Channels' : 'Direct Messages' } loading...
                </p>
            </div>
        );
    }

    return (
        <div className='team-channel-list'>
            <div className='team-channel-list__header'>
                <p className='team-channel-list__header__title'>
                    { type === 'team' ? 'Channels' : 'Direct Messages'}
                </p>
                <AddChannel  // this gives the ability to add a new channel, the + sign
                             //! props are coming from App.js then ChannelListContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />  
            </div>
            { children }
        </div>
    )
}

export default TeamChannelList;