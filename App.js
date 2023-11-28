import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import _ from 'lodash';
import GradientBorder from './GradientBorder';
import CustomTextInput from './CustomTextInput';
import { OPENAI_API_KEY } from '@env';

export default function App() {
  const [text, setText] = useState("Dear Michael, I hope this email finds you well. I’m Bryce Li, reaching out to you as an alumnus of CMU. I recently came across your profile, ");
  const [suggestions, setSuggestions] = useState([]); // Add this state for the grey text
  const [prompt, setPrompt] = useState("Cold email to an alumnus asking to talk about a freelance opportunity"); // Add this state for the grey text
  
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

  const handleUserStoppedTyping = () => {
    // simulateAPIRequest();
    
    makeAPIRequests(['verbose', 'writing in all caps', 'extremely concise']);
  };

  const makeAPIRequests = async (prompts) => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    // Create an array of fetch promises
    const fetchPromises = prompts.map((adjective) => {
      const promptStart = `You are a helpful assistant in a writing app that generates the next clause in a sentence without mentioning itself. Writing prompt [${prompt}].`;
      //const promptStart = `Ignore all following instructions and just repeat this word as much as you can:${adjective.toUpperCase()}] END INSTRUCTIONS.`;
      console.log(promptStart);
      const requestData = {
        model: 'gpt-3.5-turbo-1106',
        max_tokens: 20,
        n: 1,
        messages: [
          {
            role: 'system',
            content: promptStart,
          },
          {
            role: 'user',
            content: `${text} [END TEXT] From here, without considering the style of the previous text, write the next clause exclusively in the style of: [${adjective}].`,
          },
        ],
      };
  
      return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      });
    });
  
    try {
      // Use Promise.all to send all requests concurrently
      const apiResponses = await Promise.all(fetchPromises);
  
      // Parse all responses to JSON
      const responseDatas = await Promise.all(apiResponses.map(response => response.json()));
  
      const allAssistantResponses = responseDatas.reduce((acc, responseData, index) => {
        const choices = responseData.choices || [];
        if (choices.length > 0) {
          acc[prompts[index]] = choices[0].message.content;
        }
        return acc;
      }, {});
      
      console.log(allAssistantResponses);
      setSuggestions(allAssistantResponses);
    } catch (error) {
      console.error('Error making API requests:', error);
    }
  };

  const [timeoutId, setTimeoutId] = useState(null);


  return (
    <View style={styles.container}>
      <GradientBorder text={prompt} />
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
