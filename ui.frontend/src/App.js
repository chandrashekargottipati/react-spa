import { withModel } from '@adobe/aem-react-editable-components';
import React, { useState, useEffect } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
    category: "Friend"
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
    category: "Family"
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
    category: "Colleague"
  },
];

// Reusable Button component with hover effect
const Button = ({ children, onClick, variant = "primary" }) => {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const App = (props) => {
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : initialFriends;
  });
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Save friends to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  const filteredFriends = friends
    .filter(friend => {
      if (filter === 'all') return true;
      if (filter === 'owe') return friend.balance < 0;
      if (filter === 'owed') return friend.balance > 0;
      return friend.category.toLowerCase() === filter.toLowerCase();
    })
    .filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddFriend = (friend) => {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleDeleteFriend = (id) => {
    setFriends(friends => friends.filter(friend => friend.id !== id));
    if (selectedFriend?.id === id) setSelectedFriend(null);
  };

  const handleSplitBill = (value) => {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app-container">
      <div className="app">
        <div className="sidebar">
          <div className="filters">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Friends</option>
              <option value="owe">They Owe Me</option>
              <option value="owed">I Owe Them</option>
              <option value="friend">Friends</option>
              <option value="family">Family</option>
              <option value="colleague">Colleagues</option>
            </select>
          </div>

          <FriendsList
            friends={filteredFriends}
            selectedFriend={selectedFriend}
            onSelection={setSelectedFriend}
            onDelete={handleDeleteFriend}
          />

          {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}

          <Button
            onClick={() => setShowAddFriend(!showAddFriend)}
            variant={showAddFriend ? "secondary" : "primary"}
          >
            {showAddFriend ? 'Close' : "Add Friend"}
          </Button>
        </div>
        {
          selectedFriend && (
            <FormSplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            />
          )
        }
      </div>
    </div>
  );
};

const FriendsList = ({ friends, selectedFriend, onSelection, onDelete }) => {
  return (
    <ul className="friends-list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, selectedFriend, onSelection, onDelete }) => {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={`friend-item ${isSelected ? 'selected' : ''}`}>
      <img src={friend.image} alt={friend.name} />
      <div className="friend-info">
        <h3>{friend.name}</h3>
        <p className="category">{friend.category}</p>
        <p className={`balance ${friend.balance < 0 ? 'red' : friend.balance > 0 ? 'green' : ''}`}>
          {friend.balance < 0 && `You owe ${friend.name} ₹${Math.abs(friend.balance)}`}
          {friend.balance > 0 && `${friend.name} owes you ₹${Math.abs(friend.balance)}`}
          {friend.balance === 0 && `You and ${friend.name} are even`}
        </p>
      </div>
      <div className="friend-actions">
        <Button
          onClick={() => onSelection(friend)}
          variant={isSelected ? "secondary" : "primary"}
        >
          {isSelected ? 'Close' : 'Select'}
        </Button>
        <Button
          onClick={() => onDelete(friend.id)}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </li>
  );
};

const AddFriendForm = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?");
  const [category, setCategory] = useState("Friend");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image,
      balance: 0,
      category
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
    setCategory("Friend");
  };

  return (
    <form className="add-friend-form" onSubmit={handleSubmit}>
      <label>👫 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        required
      />

      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <label>📑 Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Friend">Friend</option>
        <option value="Family">Family</option>
        <option value="Colleague">Colleague</option>
      </select>

      <Button variant="primary">Add Friend</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [description, setDescription] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);

    // Reset form
    setBill("");
    setPaidByUser("");
    setDescription("");
    setWhoIsPaying("user");
  };

  return (
    <form className="split-bill-form" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>

      <label>💰 Bill Amount</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        placeholder="Enter bill amount"
        required
      />

      <label>📝 Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What was this for?"
        required
      />

      <label>🧍‍♂️ Your Expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) => {
          const value = Number(e.target.value);
          setPaidByUser(value > bill ? paidByUser : value);
        }}
        placeholder="Enter your share"
        required
      />

      <label>👥 {selectedFriend.name}'s Expense</label>
      <input type="number" value={paidByFriend} disabled />

      <label>🤑 Who paid the bill?</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <button className="button">Split Bill</button>
    </form>

  );
};

export default withModel(App);
