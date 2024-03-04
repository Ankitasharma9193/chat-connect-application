import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { SearchIcon } from '../assets';
import { ResultsDropdown } from './';

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();
   
  const [ query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([])
  const [directChannels, setDirectChannels] = useState([])

  useEffect(() => { // query is the input in search
    if(!query) {
        setTeamChannels([]);
        setDirectChannels([]);
    }
  }, [query])

  const getChannels = async( text ) => {
    try {
      const channelResponse = client.queryChannels({
        type: 'team', 
        name: { $autocomplete: text }, 
        members: { $in: [client.userID]}
      });
      const userResponse = client.queryUsers({
          id: { $ne: client.userID },
          name: { $autocomplete: text }
      })
      // start fetching them at same time
      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

      if(channels.length) setTeamChannels(channels);
      if(users.length) setDirectChannels(users); // direct channel is nothing but all users

    } catch (error) {
        setQuery(''); // query is what we type in input
        // we have set the query by setQuery function in onSearch() below
    }
  };

  const onSearch = (e) => {
    e.preventDefault();

    setLoading(true);
    setQuery(e.target.value); 
    getChannels(e.target.value);
  };
  
  const setChannel = ( channel ) => {
    setQuery('')
    setActiveChannel(channel);  //the text(query in the search input will be null)
    // Active channel is now the value we have input
  };

  return (
    <div className='channel-search__container'>
        <div className='channel-search__input__wrapper'>
            <div className='channel-search__input__icon'>
                <SearchIcon />
            </div>
            <input 
                className='channel-search__input__text'
                placeholder='Search'
                type='text'
                value={query}
                onChange={onSearch}
            />
            {
              query && (
                <ResultsDropdown
                  teamChannels = {teamChannels}
                  directChannels = { directChannels }
                  loading = { loading }
                  setQuery={ setQuery }
                  setChannel = { setChannel }
                  setToggleContainer={ setToggleContainer }
              /> )
            }
        </div>
    </div>
  )
}

export default ChannelSearch;