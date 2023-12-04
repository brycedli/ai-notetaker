// CustomTextInput.js
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, TextInput, Animated, useWindowDimensions, TextInputBase } from 'react-native';
import { Image, Text, StatusBar, StyleSheet, View } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Option from './Option';
import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function CustomTextInput({ text, suggestions, handleTextChange, isLoading }) {
    const [displaySuggestions, setDisplaySuggestions] = useState([]);
    const [offset, setOffset] = useState(0); 

    useEffect(() => {
        // Convert suggestions object to array of objects with index and text properties
        const suggestionsArray = Object.keys(suggestions).map((key, index) => ({
            index: (index + offset) % Object.keys(suggestions).length, // Modify this line
            key: key,
            text: suggestions[key],
        }));
        setDisplaySuggestions(suggestionsArray);
    }, [suggestions]);

    const handleSwipeUp = () => {
        // Increment index of each suggestion and reset to 0 if it exceeds array length
        const rotatedSuggestions = displaySuggestions.map(suggestion => ({
            ...suggestion,
            index: (suggestion.index + 1) % displaySuggestions.length,
        }));
        setDisplaySuggestions(rotatedSuggestions);
        setOffset((offset + 1) % displaySuggestions.length); // Add this line

    };

    const handleSwipeRight = () => {
        if (displaySuggestions.length > 0) {
            const firstSuggestion = displaySuggestions[0];
            handleTextChange(text + " " + firstSuggestion.text);
        }
    };

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    // Handle swipe gestures
    const onSwipe = (gestureName) => {
        switch (gestureName) {
            case swipeDirections.SWIPE_RIGHT:
                handleSwipeRight();
                break;
            case swipeDirections.SWIPE_UP:
                handleSwipeUp();
                break;
        }
    };

    return (
        <View style={styles.container}>


            <GestureRecognizer onSwipe={(direction, state) => onSwipe(direction)} config={config} style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={handleTextChange}
                        multiline={true}
                        onSwipeUp={handleSwipeUp}
                        autoFocus={true}
                        // placeholder='Type something to start writing.'
                    >
                    
                    </TextInput>

                    
                    
                </View>
                <View style={styles.loadingContainer}>
                        {(displaySuggestions.length > 0) ? null : <Text style={styles.inputTooltip}>Start typing for suggestions</Text>}
                        {isLoading ? <ActivityIndicator size="small" color="#CCCCCC" /> : null}
                </View>
                <View>{displaySuggestions.sort((a, b) => b.index - a.index).map((suggestion, index) => (
                    <View key={index}>
                        <Option 
                            version={index === 0 ? 'blue' : 'grey'} 
                            text={suggestion.key.concat(` ${suggestion.text}`)}
                            onPress={() => handleSwipeRight(suggestion.text)} />
                    </View>
                ))}
                </View>
            </GestureRecognizer>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    inputTooltip: {
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 1,
        color: "#CCCCCC",
    },
    container: {
        // backgroundColor: "#F00",
        gap: 4,
        flexDirection: 'column',
        flex: 1,
    },
    inputContainer: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    input: {
        
        // backgroundColor: 'red',
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 0.8,
    },

});