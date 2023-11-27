// CustomTextInput.js
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { Image, Text, StatusBar, StyleSheet, View } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Option from './Option';
import * as Animatable from 'react-native-animatable';

export default function CustomTextInput({ text, suggestions, handleTextChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displaySuggestions, setDisplaySuggestions] = useState(suggestions);


    useEffect(() => {
        setDisplaySuggestions([...suggestions]);
      }, [suggestions]);

      const handleSwipeUp = () => {
        setDisplaySuggestions((prevSuggestions) => {
            const rotatedSuggestions = [...prevSuggestions.slice(1), prevSuggestions[0]];
            setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
            return rotatedSuggestions;
        });
        animateSuggestions();
    };

    const animatableRefs = Array.from({ length: suggestions.length }, () => React.createRef());

    const animateSuggestions = () => {
        animatableRefs.forEach((ref, index) => {
            
            ref.current.fadeIn((index)*1500/animatableRefs.length);
            
            
        });
    };
    const handleSwipeRight = () => {

        if (suggestions.length > 0) {
            animatableRefs[0].current.animate({ 0: { translateX: 0 }, 1: { translateX: 400} }).then(()=>
            handleTextChange(text + " " + displaySuggestions[0])
            )
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
            <GestureRecognizer onSwipe={(direction, state) => onSwipe(direction)} config={config}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={handleTextChange}
                        multiline={true}
                        onSwipeUp={handleSwipeUp}
                    />
                </View>
                {displaySuggestions.map((option, index) => (
                    <Animatable.View
                        ref={animatableRefs[index]}
                        key={index}
                        duration={500}
                        
                    >
                        <Option version={index === 0 ? 'blue' : 'grey'} text={option} />
                    </Animatable.View>
                ))}
            </GestureRecognizer>
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
        // backgroundColor: "#F00",
        flexDirection: 'column',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'column',
    },
    input: {
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 0.8,
    },

});