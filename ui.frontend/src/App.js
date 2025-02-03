import { withModel } from '@adobe/aem-react-editable-components';
import React from 'react';

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

// Functional component for the App
const App = (props) => {
  return (
    <div>
      <div className="app">
        <div className="sidebar">
          {/* Render FriendsList component */}
          <FriendsList />
        </div>
      </div>

      {/* Render child components and pages */}
      {props.childComponents}
      {props.childPages}
    </div>
  );
};

// Functional component for the FriendsList
const FriendsList = () => {
  return (
    <ul>
      {initialFriends.map((friend) => (
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
        <button className='button'>Settle up</button>
      </li>
    </div>
  );
};

// Export the App component wrapped with `withModel` to get the model data
export default withModel(App);
