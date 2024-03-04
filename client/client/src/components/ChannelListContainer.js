import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelSearch, TeamChannelList, TeamChanneListPreview } from './';

import HospitalIcon from '../assets/hospital.png';
import LogoutIcon from '../assets/logout.png';

const cookies = new Cookies();

const SideBar= ({ logout }) => { // logout is the function as a prop getting  from actual function component, refer LINE 53
  return (
    <div className='channel-list__sidebar'>
        <div className='channel-list__sidebar__icon1'>
            <div className='icon__inner1'>
                <img src={HospitalIcon} alt='hospital' width='30' />
            </div>
        </div>

        <div className='channel-list__sidebar__icon2'>
            <div className='icon__inner2' onClick={ logout }>
                <img src={LogoutIcon} alt='logout' width='30' />
            </div>
        </div>
    </div>
  )
};

const CompanyHeader = () => {
    return (
        <div className='channel-list__header'>
            <p className='channel-list__header__text'> Medical Connect </p>
        </div>
    )
}
// to logout clear all the cookies and reload the page
// this will clear the token and thus authToken, and we will return to <Auth />, refer App.js > line 34
const logout = () => {
    cookies.remove("token");
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('hashedPassword');
    cookies.remove('phoneNumber');

    window.location.reload();
}

const teamListChannelFilter = (channels) => {
    // console.log('CHANNELS',channels)
     return channels.filter((channel) => channel.type === 'team');
 };

 const teamListDirectMessageFilter = (channels) => {
     return channels.filter((channel) => channel.type === 'messaging');
 };

const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();
   // console.log('i am client',client);
    
    // channels which has the user added.
    // this option in ChannelList component responsible to render channel names on sidebar
    const filters = { members: { $in: [client.userID] } };
   // console.log('FILTERS',filters)

    return (
      <>
        <SideBar logout= { logout }/>
        <div className='channel-list__list__wrapper'>
            <CompanyHeader />
            <ChannelSearch  setToggleContainer={setToggleContainer} />
           
            <ChannelList   // stream provides it's channel list, but we need to customize the list and thus using TeamChannel component inside it
                filters={ filters } // object, that allow to filter some messages
                channelRenderFilterFn={ teamListChannelFilter } // based on which we can filter channel
                List={(listProps) => (   // if we need to render custome list, we can do that by callback function.
                    <TeamChannelList
                        {...listProps}
                        type='team' // since this is the component for channel(team) communication
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer} 
                     
                     /> // custom component will get all the props that the channel component gets by stream
                )}
                Preview={(previewProps) => (
                    <TeamChanneListPreview 
                        {...previewProps}
                        type='team'
                        setToggleContainer={setToggleContainer} 
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                    />
                )}
            /> 

            <ChannelList className='channel-list__list'
                filters={ filters }
                channelRenderFilterFn={ teamListDirectMessageFilter }
                List={(listProps) => (
                    <TeamChannelList 
                        {...listProps}
                        type="messaging"
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}  
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChanneListPreview 
                        {...previewProps}
                        type="messaging"
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer} 
                    />
                )}
            />
        </div>
        
      </>
    )
  };

  const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => { // 2 ChannelListContent- 1st for desktop, other for mobile
    const [toggleContainer, setToggleContainer] = useState(false);

    return(
        <>
            <div className="channel-list__container"> 
                <ChannelListContent
                    setIsCreating={setIsCreating} 
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing} 
                /> 
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <ChannelListContent
                    setIsCreating={setIsCreating} 
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        
        </>
    );
  };

export default ChannelListContainer;