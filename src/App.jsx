import React, { useEffect, useReducer, useRef, useState } from 'react'
import StudybotIcon from './components/StudybotIcon'
import ChatForm from './components/ChatForm'
import ChatMessage from './components/ChatMessage'
import {customInfo} from './components/customInfo'
import wavyIcon from './assets/wavy.png'


const App = () => {
  const [chatHistory,setChatHistory]=useState([{
    hideInChat:true,
    role:"model",
    text:customInfo
  }])
  const [showChatBot,setShowChatBot]=useState(false)
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) =>{

    //Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."),{role:"model",text, isError}])
    }

    //Format chat histort for Api request
    history = history.map(({role, text}) => ({role, parts: [{text}]}))
    const requestOptions = {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents: history})
    }
    try {

      //Make the Api call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong")

      //Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    }catch(error){
      updateHistory(error.message, true)
    }
  }

  //Auto scroll down as new output genearated
  useEffect(() => {
    chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight, behaviour:"smooth"});
   } ,[chatHistory])



  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatBot(prev => !prev)}
         id='chatbot-toggler'>
        <span className='material-symbols-rounded'>
          mode_comment
        </span>
        <span className='material-symbols-rounded'>
          close
        </span>
      </button>
      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
            <StudybotIcon />
            <h2 className="logo-text">Study Bot</h2>
          </div>
          
          <button onClick={() => setShowChatBot(prev => !prev)}
             class="material-symbols-rounded">
              keyboard_arrow_down
          </button>
        </div>

        {/*chatbot body*/}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
          <StudybotIcon />

          {/*the wavy icon image and its css properties are given upon here*/}
          <p className='message-text'>
            Hey there <img src={wavyIcon} alt="waving you" style={{width:'2rem',height:'2rem',marginLeft:'-0.5em',marginTop:'-0.5em',position:'sticky',visibility:'visible',top:'15px'}} /> <br />How can I help you today?
          </p>
          
            </div> 
            
          {/*renter the chat history dynamically*/}
            {chatHistory.map((chat,index)=>(
              <ChatMessage key={index} chat={chat}/>
            ))}
          
        </div>
        <div className="chat-footer">
         <ChatForm 
          chatHistory = {chatHistory}
          setChatHistory={setChatHistory} 
          generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App
