const room = new WebsimSocket();

function ChatRoom() {
  const [inputValue, setInputValue] = React.useState('');
  
  const messages = React.useSyncExternalStore(
    room.collection('message').subscribe,
    room.collection('message').getList
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    await room.collection('message').create({
      text: inputValue.trim()
    });
    
    setInputValue('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {[...messages].reverse().map(message => (
          <div key={message.id} className="message">
            <div className="message-header">
              <img 
                className="message-avatar"
                src={`https://images.websim.ai/avatar/${message.username}`}
                alt={message.username}
              />
              <span className="message-username">{message.username}</span>
              <span className="message-time">{formatTime(message.created_at)}</span>
            </div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          className="message-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
    </div>
  );
}

ReactDOM.render(<ChatRoom />, document.getElementById('root'));
