import React, { useState } from 'react';
import { TouchableOpacity, Image, TextInput, Modal, Pressable, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native';
import { OPENAI_API_KEY } from '@env';


export default function GradientBorder({ text, vibes, setPrompt, setVibes }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [internalPrompt, setInternalPrompt] = useState("");
    const [internalVibes, setInternalVibes] = useState([])

    const handleVibesChange = (newVibes) => {

        //parse new text into emojis
        const promptsTemp = [];
        newVibes.split().forEach((vibe) => {
            const emojiRegex = /\p{Emoji}/u;

            if (emojiRegex.test(vibe)) {
                promptsTemp.push(vibe);
            }
        });
        setInternalVibes(promptsTemp);



    };

    const handlePress = () => {
        setInternalPrompt(text);
        setInternalVibes(vibes);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setPrompt(internalPrompt);
        setVibes(internalVibes);
    };

    const closeWithoutSaving = () => {
        setModalVisible(false);
    }

    const clearText = () => {
        setInternalPrompt("");
    }
    const makeVibesRequest = async () => {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const requestData = {
            model: 'gpt-3.5-turbo-1106',
            max_tokens: 30,
            n: 1,
            messages: [
                {
                    role: 'system',
                    content:
                        `You are a helpful writing assistant that does not mention itself. You will receive a PROMPT, and you will output 3 suitable yet distinct vibes in the form of emojis that could possibly describe a response to the PROMPT. Only responds in the following JSON format example. ["😊","🧚","🎮"]`,
                },
                {
                    role: 'user',
                    content: `PROMPT: [${internalPrompt}]`,
                },
            ]
        };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify(requestData),
            });

            const responseData = await response.json();
            console.log(responseData);
            if (responseData.choices && responseData.choices.length == 1) {
                const messageData = JSON.parse(responseData.choices[0].message.content);

                setInternalVibes(messageData);
            }

        } catch (error) {
            console.error('Error making API request:', error);
        }
    };
    return (
        <View style={styles.itemShadow}>

            <LinearGradient
                colors={['#FFF500', '#FF3898', '#2BA5FD', '#7AF300']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}
            >
                <Pressable
                    onPress={handlePress}
                    style={styles.button}
                >
                    <Text style={styles.staticText}>{text}</Text>
                    <Text style={styles.staticText}>{vibes}</Text>
                </Pressable>
            </LinearGradient>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}

            >

                <TouchableWithoutFeedback onPress={closeWithoutSaving}>

                    <View style={styles.centeredView}>
                        <LinearGradient
                            colors={['#FFF500', '#FF3898', '#2BA5FD', '#7AF300']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradient}
                        >
                            <View style={styles.modalButton}>
                                <View style={styles.promptGroup}>
                                    <View style={styles.promptTextGroup}>
                                        <Text style={styles.editingHeader}>Prompt</Text>
                                        <View style={styles.textBox}>
                                            <TextInput
                                                autoFocus={true}
                                                style={styles.editableText}
                                                value={internalPrompt}
                                                multiline={true}
                                                onChangeText={setInternalPrompt}>
                                            </TextInput>
                                        </View>

                                    </View>
                                    {/* <Pressable onPress={clearText} placeHolder={"Empty"} style={styles.clearButton}>
                                        <Text style={styles.editingHeader}>CLEAR</Text>
                                    </Pressable> */}
                                </View>
                                <View style={styles.promptGroup}>
                                    <View style={styles.promptTextGroup}>
                                        <Text style={styles.editingHeader}>Vibes</Text>

                                    </View>
                                    <View style={styles.editVibesGroup}>
                                        <View style={styles.editVibesBox}>
                                            <TextInput
                                                style={styles.emoji}
                                                value={internalVibes.join('')}
                                                onChangeText={handleVibesChange}>
                                            </TextInput>

                                        </View>
                                        <TouchableOpacity onPress={makeVibesRequest}>
                                            <Image style={styles.newVibesButton} source={require('./assets/NewButton.png')}></Image>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <TouchableOpacity onPress={handleModalClose} style={styles.saveButton}>
                                    <Text style={styles.saveText}>Save</Text>
                                </TouchableOpacity>


                            </View>
                        </LinearGradient>
                    </View>

                </TouchableWithoutFeedback>


            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderRadius: 15,
        gap: 6,
    },
    modalButton: {
        backgroundColor: '#FFF',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderRadius: 15,
        gap: 16,
    },
    itemShadow: {

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'column',
        gap: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 64,
        paddingBottom: 24,
    },

    gradient: {
        paddingTop: 1.5,
        borderRadius: 16,

    },
    promptGroup: {
        gap: 8,
    },
    promptTextGroup: {
        flexDirection: 'column',
        alignItems: "flex-start",

        gap: 0,
    },
    editingHeader: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        color: "#B2B2B2",
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: "#EFEFF0",
        alignContent: "flex-start",
        alignSelf: 'flex-start',
        borderRadius: 20,
    },
    editVibesGroup: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 10,
        alignSelf: "stretch",

    },
    editVibesBox: {
        height: 48,
        flex: "1 0 0",
        // backgroundColor: '#EFEFF0',
        borderColor: '#EFEFF0',
        borderStyle: 'solid',
        borderWidth: 1.5,
        borderRadius: 64,
        justifyContent: 'center',
        paddingHorizontal: 16,

    },
    emoji: {
        lineHeight: 40,
        fontSize: 36,
    },
    textBox: {
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        marginTop: 8,
        padding: 12,
        paddingTop: 4,
        borderRadius: 12,
        borderColor: '#EFEFF0',
        borderStyle: 'solid',
        borderWidth: 1.5,
    },
    editableText: {
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: -0.2,
        lineHeight: 24,
        opacity: 0.8,
    },
    newVibesButton: {
        width: 48,
        height: 48,
    },
    staticText: {
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 22,
        color: "#B2B2B2",
    },
    saveText: {
        fontSize: 20,
        fontWeight: '600',
        color: "#FFFFFF",
    },
    saveButton: {
        marginTop: 4,
        height: 48,
        paddingVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: "#007AFF",
    },
});