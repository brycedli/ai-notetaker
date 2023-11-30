import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import GradientBorder from './GradientBorder';
import CustomTextInput from './CustomTextInput';
import { OPENAI_API_KEY } from '@env';

export default function App() {
  const [text, setText] = useState("Dear Michael, I hope this email finds you well. I’m Bryce Li, reaching out to you as an alumnus of CMU. I recently came across your profile, ");
  const [suggestions, setSuggestions] = useState([]); // Add this state for the grey text
  const [prompt, setPrompt] = useState("Cold email to an alumnus asking to talk about a freelance opportunity"); // Add this state for the grey text
  const [vibes, setVibes] = useState(['📧', '💼', '🤝']);
  const handleTextChange = (newText) => {
    // Your text change logic here
    setText(newText)
    // setGreyText("Your grey text here"); // Set the grey text here
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      // Call your function here (e.g., handleUserStoppedTyping())
      handleUserStoppedTyping();
    }, 750);

    // Save the new timeout ID
    setTimeoutId(newTimeoutId);

    setSuggestions([]);
  };
  
  const handleSetPrompt = (newPrompt) => {
    setPrompt(newPrompt);
    
    setSuggestions([]);
  }
  const handleUserStoppedTyping = () => {
    // simulateAPIRequest();
    
    makeCompletionRequest();
    
  };
  
  const makeCompletionRequest = async () => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    const requestData = {
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 200,
      n: 1,
      messages: [
        {
          role: 'system',
          content: 
            `You are a helpful assistant in a writing app that generates the next 5-8 words in a sentence without mentioning itself. Given a prompt, text to be completed, and three emojis: for each the emojis, write a unique clause suggestion that fits the vibes of the emoji in the following JSON format: {"objects":[{"style":"😊","text":"Your message feels like a sprinkle of magic in our day!"},{"style":"🧚","text":"We're hard at work, and the spirit of creativity is alive and well."},{"style":"🎮","text":"We're stoked that Roots left an impression, especially during a hackathon."}]} Do not include any line breaks or escape characters.`,
        },
        {
          role: 'user',
          content: `PROMPT: [${prompt}] COMPLETION START: [${text}] EMOJIS: [${JSON.stringify(vibes)}]`,
        },
      ],
    };
  
    try {
      console.log("making request");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await response.json();
      const assistantResponses = {};
      if (responseData.choices && responseData.choices.length == 1) {
        const messageData = JSON.parse(responseData.choices[0].message.content);
        const objects = messageData.objects;
        objects.forEach(object => {
          assistantResponses[object.style] = object.text;
        });
      }
      setSuggestions(assistantResponses);
    } catch (error) {
      console.error('Error making API request:', error);
    }
  };

  const [timeoutId, setTimeoutId] = useState(null);

  return (
    <View style={styles.container}>
      <GradientBorder text={prompt} vibes={vibes} setPrompt={handleSetPrompt} setVibes={setVibes}/>
      <CustomTextInput text={text} handleTextChange={handleTextChange} suggestions={suggestions} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    gap: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 64,
    paddingBottom: 24,
  },
});
