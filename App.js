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
    
    makeAPIRequest();
  };

  const simulateAPIRequest = () => {
    // Dummy response structure for testing
    const dummyApiResponse = {
      choices: [
        {
          message: {
            content: 'This is the first suggestion.',
          },
        },
        {
          message: {
            content: 'Another suggestion for testing.',
          },
        },
        {
          message: {
            content: 'Third suggestion for testing.',
          },
        },
        // Add more choices as needed
      ],
    };

    // Simulate setting suggestions with the dummy response
    const dummyAssistantContentArray =
      dummyApiResponse.choices && dummyApiResponse.choices.length > 0
        ? dummyApiResponse.choices.map((choice) => choice.message.content)
        : [];
    console.log(dummyAssistantContentArray);
    setSuggestions(dummyAssistantContentArray);
  }

  const makeAPIRequest = async () => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestData = {
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
      n: 3,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant that completes the next clause or sentence. Do not mention yourself. The user has described their prompt as: '.concat(prompt),
        },
        {
          role: 'user',
          content: text,
        },
      ],
    };

    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await apiResponse.json();
      const choices = responseData.choices || [];
      const assistantResponses = choices.map((choice) => choice.message.content);


      setSuggestions(assistantResponses);
    } catch (error) {
      console.error('Error making API request:', error);
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
