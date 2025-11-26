import React, { useRef } from 'react'
//user value receving code...//

const ChatForm = ({chatHistory, setChatHistory,generateBotResponse}) => {
  const inputRef=useRef()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const userMessage=inputRef.current.value.trim()
    if( !userMessage ) return;
    inputRef.current.value = "";

    //update chathistory with user message//
    setChatHistory((history) => [...history, {role:"user", text:`${userMessage}`}]);

    //delay 600ms before showing Thinking... msg and generate response
    setTimeout (() => {

      //added a Thinking... placeholder for showing bot is thinking about the message//
      setChatHistory((history) => [...history, {role:"model", text:"Thinking..." }]);

    //Call the function to generate the bot's response
    generateBotResponse([...chatHistory, {role:"user", text:userMessage }]);
  },600)
}

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder='Message...' className="message-input" required/>
            <button class="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};


export default ChatForm
