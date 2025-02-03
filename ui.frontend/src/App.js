import { withModel } from '@adobe/aem-react-editable-components';
import React, { useState } from 'react';

// Initial data for friends
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

//use button
function Button({ children, onClick }) {
  return <button className='button' onClick={onClick}>{children}</button>
}

// Functional component for the App
const App = (props) => {
  const [friends, setFriends] = useState(initialFriends);
  const [showfriends, setShowFriends] = useState(false);



  function handelShowFriend() {
    setShowFriends((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriends(false);
  }

  return (
    <div>
      <div className="app">
        <div className="sidebar">
          {/* Render FriendsList component */}
          <FriendsList friends={friends} />
          {showfriends && < AddFriendForm onAddfriend={handleAddFriend} />}
          <Button onClick={handelShowFriend}>{showfriends ? 'Close' : "ADD FRIEND"}</Button>
        </div>

        <FormSplitBill />
      </div>
      {/* Render child components and pages */}
      {props.childComponents}
      {props.childPages}
    </div>
  );
};

// Functional component for the FriendsList
const FriendsList = ({ friends }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
};



// Functional component for each individual Friend
const Friend = ({ friend }) => {
  return (
    <div>
      <li>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && <p className='red'>
          you owe {friend.name} ₹ {Math.abs(friend.balance)}; pay up!
        </p>}
        {friend.balance > 0 && <p className='green'>
          {friend.name}  owe you ₹ {Math.abs(friend.balance)};
        </p>}
        {friend.balance === 0 && <p >
          you and {friend.name} are even ;
        </p>}
        <Button>Settle</Button>
      </li>
    </div>
  );
};

//form add friend
function AddFriendForm({ onAddfriend }) {
  const [name, setName]
    = useState("");
  const [image, setImage]
    = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.getRandomValues(new Uint32Array(1))[0];
    const newFriend = {
      id,
      image: `${image}?=${id}`,
      name,
      balance: 0,
    }
    onAddfriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <>
      <form className='form-add-friend' onSubmit={handleSubmit}>
        <label>👫 Name</label>
        <input type="text" placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} />
        <label>🖼️ Image url</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        <Button>Add</Button>
      </form>
    </>
  );
}

function FormSplitBill() {
  return (
    <form className='form-split-bill'>
      <h2>Split bill x</h2>
      <label>💰  bill amount</label>
      <input type="text" />
      <label>🕴️ your expences</label>
      <input type="text" />
      <label>x s expences</label>
      <input type="text" disabled />
      <label >💸 who paybill</label>
      <select>
        <option value="user">you</option>
        <option value="friend">friend</option>
      </select>
      <Button>Split</Button>
    </form>
  )
}

// Export the App component wrapped with `withModel` to get the model data
export default withModel(App);