// CustomTextInput.js
import React, { useState, useEffect } from 'react';
import { Dimensions, TextInput, Animated, useWindowDimensions} from 'react-native';
import { Image, Text, StatusBar, StyleSheet, View } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Option from './Option';
import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function CustomTextInput({ text, suggestions, handleTextChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displaySuggestions, setDisplaySuggestions] = useState([]);
    const [componentWidth, setComponentWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        // Convert suggestions object to array of objects with index and text properties
        const suggestionsArray = Object.keys(suggestions).map((key, index) => ({
            index,
            text: suggestions[key],
        }));
        setDisplaySuggestions(suggestionsArray);
    }, [suggestions]);

    const onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setComponentWidth(width);
    };

    const handleSwipeUp = () => {
        // Increment index of each suggestion and reset to 0 if it exceeds array length
        const rotatedSuggestions = displaySuggestions.map(suggestion => ({
            ...suggestion,
            index: (suggestion.index + 1) % displaySuggestions.length,
        }));
        setDisplaySuggestions(rotatedSuggestions);
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
        <View style={styles.container} onLayout={onLayout}>
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
                <GestureHandlerRootView style={{ flex: 0 }}>
                    <Carousel
                        loop
                        vertical={true}
                        width={componentWidth}
                        height={100}
                        autoPlay={false}
                        data={displaySuggestions}
                        scrollAnimationDuration={500}
                        onSnapToItem={(index) => setCurrentIndex(index)}
                        renderItem={({ item }) => (
                            <Option text={item.text} />
                        )}
                    />
                </GestureHandlerRootView>
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