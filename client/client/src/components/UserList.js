import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';
//! IMP concept
const ListContainer = ({ children }) => { // all react components has access to children prop
  return(
    <div className="user-list__container">
        <div className="user-list__header">
            <p>User</p>
            <p>Invite</p>
        </div>
        {children}
    </div>
  )
}

const UserItem = ({ user, setSelectedUserList }) => {
    
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {

        if(selected){ //confusing ???
            setSelectedUserList((prevUsers) => prevUsers.filter((prevuser) => prevuser.id !== user.id ))
          //  console.log('if selected !~~~~~', selected,  user)
        } else { // not selected means green tick
            setSelectedUserList((prevUsers) => [...prevUsers, user.id])
           // console.log('if NOT selected !~~~~~', selected,  user)
        }

        // this would be suffice if there is just 1 user
        // since there will be many, we have to keep a track of which user is been toggeled off and which ON
        // for that we move to createChannel Component
        setSelected((prevSelected) => !prevSelected)
    };

    return( // handle select toggel b/w invite icon and enpty invite icon
        <div className="user-item__wrapper" onClick={handleSelect} > 
            <div className="user-item__name-wrapper" >
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
        {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const UserList = ({ setSelectedUserList }) => {
    const { client } = useChatContext() //stream api/hook, this will give the current client, which means your id
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false);
    const [isListEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

   // we need users sometime for direct message and sometime for channel message.
    useEffect(() => {
        const getUsers = async () => {
            if(loading) return; //we do not want users while loading, thus need to go out of function and thus return
            setLoading(true);

            try {  //from here we start fetching users
                // below is similar fetching in server > controller > auth.js
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } }, // all tye user except you
                    { id: 1 }, //sorting, inbuilt logic
                    { limit: 10 }
                )
                if(response.users.length){
                    setUsers(response.users)
                } else {
                    setListEmpty(true);
                }

            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };

        if(client) getUsers();  //!IMP
    }, [])

    if(error){
        return(
           < ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
           </ListContainer>
        )
    }

    if(isListEmpty){
        return(
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

  return (
    <div>
        <ListContainer>
            { loading
                ? <div>
                    Loading Users......
                </div>
                // opening and closing () following : is just keep the jsx readable 
                // should not use {}
                // even if we remove (), it will work
                : ( users?.map((eachUser, i) => ( //! IMp concept 
                                <UserItem index={i} key={ eachUser.id } user={ eachUser } setSelectedUserList={ setSelectedUserList }/>
                            ))
                )
            }
        </ListContainer>
    </div>
  )
}

export default UserList;