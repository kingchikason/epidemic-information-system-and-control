import React,{ Component } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Alert,
            Modal, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-community/picker';

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            names: '',
            phone: '',
            email: '',
            gender: 'Female',
            proffession: '',
            isLoading: false,
            file_name1: '',
            file_name2: '',
            fileUri1: '',
            fileUri2: '',
            file_data1: '',
            file_data2: ''
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <ScrollView style={styles.body}>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: 'normal', marginTop: 10}}>
                            WEISC Membership Registration 
                        </Text>

                        <Text style={{marginTop: 10}}>Names:</Text>
                        <TextInput placeholder='Enter your Names' onBlur={() =>{this.setState({txt1: false}); this._handleNext('input_2')}} blurOnSubmit={true}
                                onFocus={() => this.setState({txt1: true})} onChangeText={text => this.setState({names: text})} returnKeyType='next' keyboardType='name-phone-pad'
                                style={{height: 45, marginTop: 2, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.txt1 ? 'skyblue' : 'gray'}} >
                        </TextInput>

                        <Text style={{marginTop: 10}}>Phone:</Text>
                        <TextInput placeholder='Enter phone number i.e +1478095645' onBlur={() =>{ this.setState({txt2: false}); this._handleNext('input_3')}} blurOnSubmit={true} ref='input_2'
                                onFocus={() => this.setState({txt2: true})} onChangeText={text => this.setState({phone: text})} returnKeyType='next' keyboardType='phone-pad'
                                style={{height: 45, marginTop: 2, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.txt2 ? 'skyblue' : 'gray'}} >
                        </TextInput>

                        <Text style={{marginTop: 10}}>Email:</Text>
                        <TextInput placeholder='Enter your email address' onBlur={() => this.setState({txt2: false})} blurOnSubmit={true} ref='input_3'
                                onFocus={() => this.setState({txt3: true})} onChangeText={text => this.setState({email: text})} returnKeyType='done' keyboardType='email-address'
                                style={{height: 45, marginTop: 2, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.txt3 ? 'skyblue' : 'gray'}} >
                        </TextInput>

                        <Text style={{marginTop: 10}}>Gender:</Text>
                        <View style={{ borderRadius: 5, borderColor: 'gray',borderWidth: 1, justifyContent: 'center', alignContent: 'stretch'}}>
                            <Picker style={{borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} selectedValue={this.state.gender}
                                onValueChange={(item, index) => this.setState({gender: item}) }>
                                <Picker.Item  label='Female' value='Female' />
                                <Picker.Item  label='Male' value='Male' />
                                <Picker.Item  label='Others' value='Others' />
                            </Picker>
                        </View>

                        <Text style={{marginTop: 10}}>Proffession:</Text>
                        <View style={{borderRadius: 5, borderColor: 'gray',borderWidth: 1, justifyContent: 'center', alignContent: 'stretch'}}>
                            <Picker style={{borderColor: 'gray', borderWidth: 1, borderRadius: 5}} selectedValue={this.state.proffession}
                                onValueChange={(item, index) => this.setState({proffession: item}) }>
                                <Picker.Item  label='Engineer' value='Engineer' />
                                <Picker.Item  label='Medical' value='Medical' />
                                <Picker.Item  label='Scientist' value='Scientist' />
                                <Picker.Item  label='Student' value='Student' />
                                <Picker.Item  label='Journalist' value='Journalist' />
                                <Picker.Item  label='Others' value='Others' />
                            </Picker>
                        </View>

                        <Text style={{marginTop: 15}}>Upload verification documents(image file)</Text>
                        <View style={{ flexDirection: 'row', justifyContent:'flex-start', alignContent: 'flex-start'}} >
                            <Button title='upload file 1' buttonStyle={{height: 40, backgroundColor: 'gray'}} type="solid" titleStyle={{color: '#fff'}} 
                                icon={<Icon name='add' type='ionicons' iconStyle={{ color: '#fff', marginStart: 15}}/>} iconRight onPress={this._loadMediaOne} >
                            </Button>
                            <Button title='upload file 2' buttonStyle={{height: 40, backgroundColor: 'gray', marginStart: 20}} type="solid" titleStyle={{color: '#fff'}} 
                                icon={<Icon name='add' type='ionicons' iconStyle={{color: '#fff', marginStart: 10}}/>} iconRight onPress={this._loadMediaTwo} >
                            </Button>
                        </View>

                        <Button title='Submit Membership Request' buttonStyle={styles.regbtn}
                                onPress={this._createAccount}>
                        </Button>
                </ScrollView>

                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"  />
                    </View>
                </Modal>
                
            </KeyboardAvoidingView>
        );
    }

    _loadMediaOne = () =>{
        if(this.state.phone.length > 2){
            const options = {
                title: 'Select Image file',
                quality: 1,
                mediaType: 'photo'
            };
            //weisc-resources
            ImagePicker.launchImageLibrary(options, async (response) => {
                if(response.didCancel){
                    Alert.alert('', 'cancelled file upload.');
                }
                else if(response.error){
                    Alert.alert('', 'error reading file');
                }
                else{
                    //uploads the image file to the server
                    let xs = this.state.phone;
                    let fname =  + xs.substring(1) + 'doc-jT071xatQb.jpg';
                    let dat = response.data;

                    this.setState({ file_name1: fname, fileUri1: response.uri, file_data1: dat });

                }
            })
        }
        else{
            Alert.alert('', 'Please enter your Phone number first')
        }
    }

    _loadMediaTwo = () =>{
        if(this.state.phone.length > 2){
            const options = {
                title: 'Select another Image file',
                quality: 1,
                mediaType: 'photo'
            };

           ImagePicker.launchImageLibrary(options, async (response) => {
                //check the result of the action
                if(response.didCancel){
                    //the user has cancelled the upload
                    Alert.alert('', 'upload cancelled.');
                }
                else if(response.error){
                    //error uploading the file
                    Alert.alert('', 'error uploading file.');
                }
                else {
                    //uploads the image file to the server
                    let xs = this.state.phone;
                    let name = xs.substring(1) + 'doc2-jT071xatQb.jpg';
                    let dat =  response.data;
                    this.setState({file_name2: name, fileUri2: response.uri, file_data2: dat});

                }
            });

        }
        else{
            Alert.alert('', 'Please enter your Phone number first')
        }
        
    }

    _createAccount = async () =>{
        let isValid = this._validateData();
        if(isValid == true){
            this.setState({isLoading: true});
            //submit the data for verification
            let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/user/register';
            
            fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: this.state.names,
                        phone: this.state.phone,
                        email: this.state.email,
                        gender: this.state.gender,
                        proffession: this.state.proffession,
                        document1: this.state.file_data1,
                        document2: this.state.file_data2,
                        file_name1: this.state.file_name1,
                        file_name2: this.state.file_name2
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading: false});
                    Alert.alert('', responseJson);
                })
                .catch(err => {
                    this.setState({isLoading: false});
                    Alert.alert('', err.message);
                });
            
        }
    }

    _validateData = () =>{
        //check the names
        if(this.state.names.length == 0){
            Alert.alert('', 'Enter your Names');
            return false;
        }
        //check the phone number
        if(this.state.phone.length == 0){
            Alert.alert('', 'Enter your phone number');
            return false;
        }
        else if(this.state.phone.charAt(0) != '+'){
            Alert.alert('', 'Phone number should contain country code i.e +140570445');
            return false;
        }
        //check the email
        if(this.state.email.length == 0){
            Alert.alert('', 'Enter your email address');
            return false;
        }
        //check the proffession 
        if(this.state.proffession.length == 0){
            Alert.alert('', 'Select your proffession');
            return false;
        }

      return true;
    }

    _handleNext = (nxtField) => {
        this.refs[nxtField].focus();
    }

    requestPermission = async () => {
        try{
            const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: 'WEISC App Permission',
                            message: 'WEISC App needs access your photos',
                            buttonNeutral: 'Ask me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'Ok'
                        }
            );
            //checks if the permission was granted
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                //continue to read user photo gallery

            }
            else {
                //access denied can not read the gallery
                Alert.alert('', 'Permission not granted.')
            }
        }
        catch(err){
            console.log(err);
            console.log(err.message);

            Alert.alert('', err);
        }
    }
    
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingStart: 14,
        paddingEnd: 14
    },

    regbtn: {
        marginTop: 20,
        marginBottom: 15,
        backgroundColor:'skyblue', 
        borderRadius: 5, 
        height: 45
    }
});