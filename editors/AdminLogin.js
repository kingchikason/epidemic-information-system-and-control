import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import {Button, Avatar } from 'react-native-elements';

class AdminLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            emailEnabled: false,
            passEnabled: false,
            passError: false,
            emailError: false,
            loginUrl: 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/user/login'
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <ScrollView style={{ flex: 1, }}>
                    <View style={styles.logo_container}>
                        <Avatar size='xlarge' source={require('../assets/images/ic3.png')} rounded/>
                    </View>
                    <View style={styles.login_container}>
                        <Text style={{fontSize: 18, color: 'black'}}>Content Editors Login</Text>
                        <TextInput placeholder='Enter Email address' keyboardType='email-address' returnKeyType="next" style={{ borderRadius: 5,
                            borderWidth: 1, borderColor: this.state.emailEnabled == true ? 'skyblue' : ( this.state.emailError == true ? 'red' : 'gray'), paddingStart: 8, height: 45, marginTop: 5 }} 
                            onBlur={() => this.handlesNext('2')} onFocus={() => this.setState({emailEnabled: true, emailError: false})} onChangeText={text => this.setState({email: text})}>
                        </TextInput>

                        <TextInput placeholder='Enter Password' secureTextEntry={true} returnKeyType='done' ref='2' style={{ borderRadius: 5, borderWidth: 1,
                            borderColor: this.state.passEnabled == true ? 'skyblue' : ( this.state.passError == true ? 'red' : 'gray'),
                            paddingStart: 8, marginTop: 10, height: 45 }} onBlur={() => this.setState({passEnabled: false})} onFocus={() => this.setState({passEnabled: true, passError: false})}
                            onChangeText={text => this.setState({password: text})} >
                        </TextInput>

                        <Button type='solid' title='Sign-In' buttonStyle={styles.login} onPress={() => this.userLogin()} />

                        <Button type='outline' title='Create Account' buttonStyle={styles.regbtn} onPress={this._regAccount} titleStyle={{color: 'green'}}/>
                        <Text style={{ fontSize: 12, marginEnd: 40, marginTop: 5}}>
                            Note: This page is reserved for the content providers and managers.
                        </Text>
                        <Text style={{ fontSize: 12, marginEnd: 40}}>
                            Only an Editor or Admin with the right email and password can log-in to this page.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    handlesNext = (nxtField) => {
        this.setState({emailEnabled: false});
        this.refs[nxtField].focus();
    }

    userLogin = () =>{
        let em = this.state.email;
        let ps = this.state.password;
        let url = this.state.loginUrl;
        console.log('url: ' + url);
        if(em.length != 0){
            if(ps.length != 0){
                //login the user into the editor page
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                       'email' : em,
                       'password' : ps 
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('logged in');
                    let responseCode = responseJson.code;
                    if(responseCode == 200){
                        //collect returned data from the login communication
                        let us = responseJson.user.name;
                        let em  = responseJson.user.email;
                        let ph = responseJson.user.phone;
                        let rl = responseJson.user.role;
                        //navigates the user to the content editing page
                        this.props.navigation.navigate('Content', {name: us, email: em, phone: ph, role: rl});
                    }
                    else{
                        //notify the user that the email is 
                        Alert.alert('', 'Email or Password not correct.', [{
                            text: 'Ok',
                            onPress: () => console.log('login error.'),
                            style: 'default'
                        }],
                        {
                            cancelable: true
                        });
                    }

                })
                .catch((error) => {
                    console.log(error);
                    //notify the user that the email is 
                    Alert.alert('', error.message, [{
                        text: 'Ok',
                        onPress: () => console.log('login error.'),
                        style: 'default'
                    }],
                    {
                        cancelable: true
                    });
                });
            }
            else{
                this.setState({passError: true});
            }
        }
        else{
            this.setState({emailError: true});
        }
    }

    _regAccount = () => {
        console.log('create an account');
        //navigates to the account registration page
        this.props.navigation.navigate('RegisterUser');
    }
    
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },

    logo_container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },

    login_container: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingStart: 18,
        paddingEnd: 18,
        marginTop: 20
    },

    login: {
        backgroundColor: 'skyblue',
        borderRadius: 5,
        height: 45,
        marginTop: 20
    },

    regbtn: {
        borderRadius: 5,
        height: 45,
        marginTop: 20,
        borderColor: 'green'
    },

});
export default AdminLogin;