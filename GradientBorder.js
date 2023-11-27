// GradientBorder.js
import React from 'react';
import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function GradientBorder({ text }) {
    return (
        <View style={styles.gradientBorder}>
            <LinearGradient
                colors={['#FFF500', '#FF3898', '#2BA5FD', '#7AF300']}
                start={{ x: 0, y: 0.5 }} // Adjust the start position
                end={{ x: 1, y: 0.5 }} // Adjust the end position        
                style={styles.gradient}
            >
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#F5F5F5' : '#FFF',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 15,
                        },
                    ]}
                >
                    <Text style={styles.staticText}>{text}</Text>
                </Pressable>
            </LinearGradient>
        </View>
    );
}
const styles = StyleSheet.create({
    gradientBorder: {

        borderRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
    },
    gradient: {
        paddingTop: 1.5,
        borderRadius: 16,
    },
    staticText: {
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 22,
        opacity: 0.3,
      },
});