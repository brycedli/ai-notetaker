import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const Option = ({ version, text }) => {
    const containerStyle =
        version === 'blue' ? styles.blueContainer : styles.greyContainer;
    const textStyle = version === 'blue' ? styles.blueText : styles.greyText;
    const imageSource = version === 'blue' ? require('./assets/right.png') : require('./assets/up.png');

    return (
        <View style={containerStyle}>
            <Text style={textStyle}>
                {text && text.length > 0 ? (
                    <>
                        {text}{' '}
                        <Image
                            style={styles.icon}
                            source={imageSource}
                        />
                    </>
                ) : (
                    null // or any other fallback content
                )}
            </Text>
        </View>

    );
};


const styles = StyleSheet.create({
    blueContainer: {
        paddingTop: 4,
        paddingBottom: 8,
    },
    greyContainer: {
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    icon: {
        width: 56,
        height: 16,
    },
    greyText: {
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 1,
        color: "#CCCCCC",
    },
    blueText: {
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 0.8,
        color: "#80BCFF",
    },
});

export default Option;
