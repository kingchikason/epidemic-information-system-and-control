import React, {Component} from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView,
         Modal, ActivityIndicator, TextInput, Alert, Keyboard, Platform } from 'react-native';
import { Icon, Button, Header} from 'react-native-elements';

class ReportCase extends Component {

    constructor(props){
        super(props);
        this.state = {
            reporter: '',
            phone:'',
            profile_name: '',
            reporter_address: '',
            case_location: '',
            case_detail: '',
            case_situation: '',
            textfield1: false,
            textfield2: false,
            textfield3: false,
            textfield4: false,
            textfield5: false,
            textfield6: false,
            textfield7: false,
            isLoading: false
        }
    }

    componentDidMount(){
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidHide', this._keyboardInputHide);
    }

    render(){

        return(           
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}} behavior={Platform.OS == 'ios' ? 'padding' : null} >
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'Report Epidemic Case', style:{color: '#fff'} }} >
                </Header>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.body}>
                        <Text style={{fontSize: 16, marginTop: 5, color: 'green'}}>Report Any Suspected Case of Epidemic around you.</Text>

                        <Text style={{marginTop: 5}}>Name:</Text>
                        <TextInput placeholder='Enter your Names' returnKeyType="next" ref='1' onBlur={() => {this.setState({textfield1: false}); this.handlesNext('2');}} textContentType='name'
                            style={{height: 45, paddingStart: 8, borderRadius: 5, marginTop: 2, borderWidth: 1, borderColor: this.state.textfield1 ? 'skyblue' : 'gray'}}
                            onChangeText={text => this.setState({reporter: text})} onFocus={() => this.setState({textfield1: true})}>    
                        </TextInput>

                        <Text style={{marginTop: 10}}>Phone:</Text>
                        <TextInput placeholder='Enter your Phone Number' returnKeyType="next" ref='2' onBlur={() => {this.setState({textfield2: false}); this.handlesNext('3'); }} textContentType='telephoneNumber'
                            style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.textfield2 ? 'skyblue' : 'gray'}}
                            onChangeText={text => this.setState({phone: text})} onFocus={() => this.setState({textfield2: true})} keyboardType='phone-pad'>    
                        </TextInput>

                        <Text style={{marginTop: 10}}>Address:</Text>
                        <TextInput placeholder='Enter your Country, State, Town' returnKeyType="next" ref='3' onBlur={() => this.setState({textfield3: false})}
                            style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.textfield3 ? 'skyblue' : 'gray'}} textContentType='streetAddressLine1'
                            onChangeText={text => this.setState({reporter_address: text})} onFocus={() => this.setState({textfield3: true})}>    
                        </TextInput>


                        <Text style={{marginTop: 10}}>Public Profile:</Text>
                        <TextInput placeholder='Enter your Facebook or Twitter name/link' returnKeyType="next" ref='4' onBlur={() => {this.setState({textfield4: false}); this.handlesNext('5')}}
                            style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.textfield4 ? 'skyblue' : 'gray'}}
                            onChangeText={text => this.setState({reporter_address: text})} onFocus={() => this.setState({textfield4: true})}>    
                        </TextInput>

                        <Text style={{marginTop: 10}}>Case Location:</Text>
                        <TextInput placeholder='Enter location of the report (Country, State, Town, Street, House)' returnKeyType='done' ref='5'
                            style={{height: 100, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.textfield5 ? 'skyblue' : 'gray', paddingTop: 8, paddingStart: 8}} multiline
                            onChangeText={text => this.setState({case_location: text})} onFocus={() => this.setState({textfield5: true})} textAlignVertical='top' blurOnSubmit={false} >    
                        </TextInput>

                        <Text style={{marginTop: 10}}>Case Symptoms:</Text>
                        <TextInput placeholder='Describe the Symptoms shown by the person' returnKeyType='done' ref='6'
                            style={{height: 100, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.textfield6 ? 'skyblue' : 'gray', paddingStart: 8, paddingTop: 8}} multiline
                            onChangeText={text => this.setState({case_detail: text})} onFocus={() => this.setState({textfield6: true})} textAlignVertical='top' >    
                        </TextInput>

                        <Text style={{marginTop: 10}}>Case Summary:</Text>
                        <TextInput placeholder='Describe what you know about the person(Name, Gender, Age) and the person current situation' returnKeyType='done' ref='7'
                            style={{height: 100, paddingStart: 8, borderRadius: 5, borderWidth: 1, borderColor: this.state.textfield7 ? 'skyblue' : 'gray', paddingTop: 8, paddingStart: 8}} multiline
                            onChangeText={text => this.setState({case_situation: text})} onFocus={() => this.setState({textfield7: true})} textAlignVertical='top' >    
                        </TextInput>


                        <Button title='Submit Case' buttonStyle={styles.btnOk} onPress={this._dataSubmit}
                                titleStyle={{color: '#fff', fontSize: 16}} />

                    </View>
                </ScrollView>
                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"  />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        );
    }

    _dataSubmit = () => {
        //verify the data provided for accuracy
        let isValid = this._validateData();
        if(isValid == true){
            //shows progress bar
            this.setState({isLoading: true});
            //perform network operation to submit the data report provided.
            let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/report';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    reporter: this.state.reporter,
                    reporter_address: this.state.reporter_address,
                    reporter_profile: '' + this.state.profile_name,
                    reporter_phone: this.state.phone,
                    case_detail: this.state.case_detail,
                    case_location: this.state.case_location,
                    case_situation: this.state.case_situation
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({isLoading: false});
                Alert.alert(responseJson.message);
                //reset the UI
                this.forceUpdate();
            })
            .catch((error) => {
                this.setState({isLoading: false});
                Alert.alert(error);
            });
        }
    }

    _validateData(){
        if(this.state.reporter.length == 0){
            Alert.alert(
                '','Please provide your Name', [{
                    text: 'Ok',
                    onPress: () => console.log('enter name'),
                    style: 'default'
                }],
                {
                    cancelable: true
                }
            );

            return false;
        }

        if(this.state.phone.length == 0){
            Alert.alert(
                '','Enter your phone number', [{
                    text: 'Ok',
                    onPress: () => console.log('enter class'),
                    style: 'default'
                }],
                {
                    cancelable: true
                }
            );

            return false;
        }

        if(this.state.reporter_address.length == 0){
            Alert.alert(
                '','Enter your address/location', [{
                    text: 'Ok',
                    onPress: () => console.log('enter class'),
                    style: 'default'
                }],
                {
                    cancelable: true
                }
            );

            return false;
        }

        if(this.state.case_location.length == 0){
            Alert.alert(
                '','Provide the Case Location', [{
                    text: 'Ok',
                    onPress: () => console.log('enter class'),
                    style: 'default'
                }],
                {
                    cancelable: true
                }
            );

            return false;
        }

        if(this.state.case_situation.length == 0){
            Alert.alert('','Provide the situation report of the person');
            return false;
        }

        if(this.state.case_detail.length == 0){
            Alert.alert('','Enter the Case in detail(Symptoms)');
            return false;
        }

        return true;
    }

    handlesNext = (nxtField) =>{
        this.refs[nxtField].focus();
    }

    _keyboardInputHide = () =>{
        if(this.state.textfield7 == true){
            this.refs['7'].blur();
        }

        if(this.state.textfield6 == true){
            this.refs['7'].focus();
        }

        if(this.state.textfield5 == true){
            this.refs['6'].focus();
        }

    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingEnd: 14,
        paddingStart: 14
    },

    btnOk: {
        height: 45,
        marginTop: 30,
        marginBottom: 8,
        backgroundColor: 'skyblue',
        borderRadius: 5
    },

});

export default ReportCase;