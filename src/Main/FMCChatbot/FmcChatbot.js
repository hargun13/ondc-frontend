import React, { useState } from 'react';
import { Button } from '@mui/material';
import './FmcChatbot.css';
import img from './compliance.png'
import person from './person.png'

const FmcChatbot = () => {
  const [inputText, setInputText] = useState('');
  const formatDate = (date) => {
    const h = `0${date.getHours()}`;
    const m = `0${date.getMinutes()}`;
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };
  const [messages, setMessages] = useState([
    {
      name: 'Compliance Bot',
      img: img,
      side: 'left',
      text: 'Welcome to the Compliance Bot, ask me anything related to compliance infact ask me to get a list compliances to be completed for you',
      time: formatDate(new Date()),
    },
  ]);

  const appendMessage = (name, img, side, text) => {
    const updatedMessages = [...messages, {
      name,
      img,
      side,
      text,
      time: formatDate(new Date()),
    }];
    setMessages(updatedMessages);
  };

  const botResponse = async (rawText) => {
    try {
      const response = await fetch("https://ondc-backend.onrender.com/get_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msg: rawText }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const msgText = data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { name: 'Chat Bot', img: img, side: 'left', text: msgText, time: formatDate(new Date()) },
      ]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };
  
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputText) return;

    appendMessage('You', person, 'right', inputText);
    setInputText('');
    await botResponse(inputText);
  };

  return (
    <div>
        <h1 className='text-3xl py-3 px-2'>Compliance Bot - Your Compliance and Checklist companion</h1>
        <div className="msger">
            <main className="msger-chat">
                {messages.map((msg, index) => (
                <div key={index} className={`msg ${msg.side}-msg`}>
                    <div className="msg-img" style={{ backgroundImage: `url(${msg.img})`}}>
                    </div>
                    <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">{msg.name}</div>
                        <div className="msg-info-time">{msg.time}</div>
                    </div>
                    <div className="msg-text">{msg.text}</div>
                    </div>
                </div>
                ))}
            </main>
            <form className="msger-inputarea" onSubmit={handleSubmit}>
                <input
                type="text"
                className="msger-input"
                id="textInput"
                placeholder="Enter your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                />
                
                <Button id="generateButton" variant='contained' style={{fontSize:"16px", textTransform:"capitalize", fontWeight:"bold", marginLeft:"10px"}}>Generate Checklist</Button>
                <div id="tooltip" class="tooltip">You can use a compliance list that is given by the Compliance Bot to convert it to a checklist with reminders for you to complete your compliances</div>

                <button type="submit" className="msger-send-btn">
                Send
                </button>
            </form>
        </div>
    </div>
  );
};

export default FmcChatbot;
