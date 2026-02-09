// import { Button } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, Image, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginView() {
    const bgImage = require('@/assets/images/login-background.jpg')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const passwordRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [emailText, setEmail] = useState('');

    // var isFormValid = false
    const [isFormValid, setIsFormValid] = useState(false);
    var isVisible = false

    const onChangeEmail = (email: string) => {
        // Оставляем только цифры
        // const cleaned = emailText.replace(emailRegex, '');
        const isValid = emailRegex.test(email);
        setIsFormValid(isValid)
    };

    const [passwordText, setPassword] = useState('');

    const onChangePassword = (password: string) => {
        // Оставляем только цифры
        // const cleaned = password.replace(passwordRegex, '');
        // setPassword(cleaned);
        // isFormValid = passwordRegex.test(password);
    };
//react hook form почитать
// react/react-native под капотом
// Максимилян Шварцмюллер коурсера курс react native, курс по js
// как работает рендер ререндер, проксы, hook-и
// state manager, редакс и цустант
    return (
        <View style={{ height: '100%', width: '100%', backgroundColor: 'black' }}>
            <ImageBackground
                source={bgImage}
                resizeMode="cover"
                style={styles.background}
                imageStyle={{ flex: 1, backgroundColor: 'rgba(156, 148, 148, 0.5)' }}>
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(25,25,25,0.4)' }]} />
                <SafeAreaView style={{ flex: 1, justifyContent: 'space-around' }}>
                    <View style={{ marginTop: 44 }}>
                        <View>
                            <Text style={{ fontSize: 18, fontFamily: 'SF Pro Display', color: 'white' }}>Welcome to</Text>
                            <Text style={{ fontSize: 36, fontFamily: 'Apercu Pro', color: 'white' }}>Recipe Book</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ marginBottom: 44 }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeEmail}
                                placeholder="Enter email"
                                placeholderTextColor="rgba(255, 255, 255, 1)">
                            </TextInput>
                            <Text style={[styles.error, {opacity: isVisible ? 1 : 0}]}>Тут ошибка</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangePassword}
                                placeholder="Enter Password"
                                placeholderTextColor="rgba(255, 255, 255, 1)"
                                secureTextEntry={true}>
                            </TextInput>
                            <Text style={[styles.error, {opacity: isVisible ? 1 : 0}]}>Тут ошибка</Text>
                        </View>
                        <Text style={styles.forgetPassword}
                            onPress={() => alert('Текст нажат!')}>
                            Forget password?
                        </Text>
                        <TouchableOpacity
                            style={[styles.button, !isFormValid && styles.buttonDisabled]}
                            disabled={!isFormValid}>
                            <Text style={[styles.greenText, !isFormValid && styles.disableButtonText]}>Login</Text>
                        </TouchableOpacity>
                        <Text style={styles.loginwith}>
                            Login with
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
                            <TouchableOpacity
                                style={[styles.socialNetworkButton, styles.whitebutton]}
                                onPress={() => console.log('Нажато!')}
                            >
                                <Image
                                    source={require('@/assets/images/google.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.socialNetworkButton, styles.bluebutton]}
                                onPress={() => console.log('Нажато!')}
                            >
                                <Image
                                    source={require('@/assets/images/facebook.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.loginwith}>
                            or
                        </Text>
                        <TouchableOpacity
                            style={[styles.greenButton]}
                            disabled={!isFormValid}>
                            <Text style={styles.whiteText}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            </ImageBackground>
        </View>
    )

}



const styles = StyleSheet.create({
    input: {
        height: 45,
        // margin: 12,
        // marginVertical: 12,
        borderWidth: 1,
        padding: 18,
        borderColor: 'white',
        color: 'white',
        borderRadius: 10,
        backgroundColor: 'rgba(244, 235, 235, 0.45)',
        marginTop: 12,
        // display: showText ? 'flex' : 'none'
    },
    background: {
        flex: 1, // Растягивает на весь экран
        paddingHorizontal: 20,
    },
    error: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 7, 7, 0.5)',
        borderRadius: 8,
        paddingHorizontal: 18
    },
    button: {
        height: 45,
        color: 'rgba(52, 168, 83, 1)',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    greenText: {
        color: 'rgba(52, 168, 83, 1)',
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Apercu Pro'
    },
    whiteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Apercu Pro'
    },
    disableButtonText: {
        color: 'rgba(74, 5, 5, 0.45)',
        fontSize: 18,
        fontFamily: 'Apercu Pro'
    },
    buttonDisabled: {
        backgroundColor: '#A9A9A9', // Серый для неактивной
        opacity: 0.7,
        color: 'white'
    },
    forgetPassword: {
        fontSize: 14,
        fontFamily: 'Apercu Pro',
        fontWeight: 700,
        textDecorationLine: 'underline',
        color: 'white',
        textAlign: 'right',
        paddingBottom: 18
    },
    loginwith: {
        fontSize: 14,
        fontFamily: 'Apercu Pro',
        fontWeight: 700,
        color: 'white',
        textAlign: 'center',
        paddingBottom: 18,
        paddingVertical: 12
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    bluebutton: {
        backgroundColor: 'rgba(59, 89, 153, 1)',
        borderRadius: 10
    },
    whitebutton: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    socialNetworkButton: {
        height: 45,
        width: 145,
        justifyContent: 'center',
        alignItems: 'center'
    },
    greenButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'rgba(52, 168, 83, 1)',
    }
});