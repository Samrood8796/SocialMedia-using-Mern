import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContactList from '../ContactList/ContactList';
import { addChat, getAllusers } from '../../state/apiCalls';
import { FaUser } from 'react-icons/fa';
const Contact = ({ conversation, currentUser, setCurrentChat,setConversation }) => {
  const userData = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  const [searchitem, setSearchItem] = useState("")
  let [allUsers, setAllusers] = useState([])
  let [filterUsers, setFilterUsers] = useState([])
  const handleSearch = (e) => {
    console.log(e.target.value)
    setSearchItem(e.target.value)
  }
  useEffect(() => {
    const allusers = async () => {
      const users = await getAllusers(token)
      setAllusers(users)
    }
    allusers()
  }, [])
  useEffect(() => {
    const users = allUsers?.filter((user) => {
      return user?.userName?.toLowerCase().includes(searchitem) && user._id !== userData._id
    })
    setFilterUsers(users)
  }, [searchitem ])
  const handleChat =async (friendId) =>{
    const response =await addChat(token,userData._id, friendId)
    console.log(response  );
    if(!response.chatExist){
      setConversation([...conversation,response])
    }
    setSearchItem("")
  }
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4">
      <div className="relative mb-4">
        <input onChange={handleSearch} value={searchitem}
          className="w-full h-12 px-4 rounded-md border border-zinc-400 focus:outline-none  "
          type="text"
          placeholder="Search for users"
        />
         <ul className="absolute z-100 top-10 bottom-0 right-0  w-full rounded-md shadow-md mt-1 divide-y divide-gray-200">
            {filterUsers?.length > 0 && searchitem !== "" ? filterUsers.map((user) => (
              <li key={user._id} className="bg-white cursor-pointer flex">
                <div className='border p-1 flex w-full hover:bg-gray-100'>
                  {user.profilePic ?
                    <img className=' w-10 h-10 rounded-full' src={user.profilePic} /> :
                    <div className='block border-zinc-400 border w-10 h-10 rounded-full'>
                      <FaUser className='w-full h-full rounded-full' />
                    </div>
                  }
                  <div onClick={()=>handleChat(user._id)}  className='px-2'> 
                    <p>{user.userName}</p>
                    <p className='-mt-1'>{user.name}</p>
                  </div>
                </div>
              </li>
            )) : ""}
          </ul>
      </div>
      {conversation.map((item, index) => (
        <div onClick={() => setCurrentChat(item)} key={index}>
          <ContactList conversation={item} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
};

export default Contact;
