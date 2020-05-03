import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, TextInput,
        Modal, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';

export default class Control extends Component {
    constructor(props){
        super(props);
        this.state = {
            textfield1: false,
            textfield2: false,
            textfield3: false,
            textfield4: false,
            isLoading: true,
            e_class: '',
            e_name: '',
            e_control: '',
            e_precaution: '',
            epidemicClasses: [],
            epidemicNames: []
        }
    }

    componentDidMount(){
                //fetch the network data here
                console.log('trying to get data')
                let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/epidemic/epidemics';
                fetch(url, {
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((responseJson) =>{
                    let en = [];
                    let ec = [];
                    let previous = '';
                    responseJson.forEach((vl, id) =>{
                        en[id] = {'name' : vl.name};
                        if(vl.family != previous){
                            ec[id] = {'family' : vl.family};
                        }
                        previous = vl.family;
                    });
                    this.setState({epidemicClasses: ec, epidemicNames: en});
                    //closes the progress loading
                    this.setState({isLoading: false});
                })
                .catch((error) => {
                    //closes the progress loading
                    this.setState({isLoading: false});
                    console.log('failed to load data');
                });
    }

    render(){
        return(
            <KeyboardAvoidingView style={{ flex: 1}} behavior="padding">
                <ScrollView style={styles.body}>
                    <Text style={{marginTop: 10, color: 'blue', fontSize: 16}}>Add Information about Precautions And Control</Text>

                    <Text style={{marginTop: 10}}>Epidermic Name:</Text>
                    <TextInput placeholder='Enter Epidermic Name' onFocus={() => this.setState({textfield1: true}) } ref='name_input'
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, 
                        borderColor: this.state.textfield1 == true ? 'skyblue' : 'gray'}} returnKeyType="done" value={this.state.e_name} >             
                    </TextInput>
                    <Modal visible={this.state.textfield1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                        <View style={styles.familymodal}>
                            <FlatList data={this.state.epidemicNames}
                                renderItem={this._renderENames}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Epidermic class:</Text>
                    <TextInput placeholder='Enter Epidermic class' onFocus={() => this.setState({textfield2: true})} ref='class_input'
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, 
                        borderColor: this.state.textfield2 == true ? 'skyblue' : 'gray'}} returnKeyType="next" value={this.state.e_class} >             
                    </TextInput>
                    <Modal visible={this.state.textfield2} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['class_input'].blur()} >
                        <View style={styles.classmodal}>
                            <FlatList data={this.state.epidemicClasses}
                                renderItem={this._renderEClass}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Control:</Text>
                    <TextInput placeholder='Enter Epidermic Controls (start each line with "#")' onBlur={ () => this.setState({ textfield3: false }) } blurOnSubmit={false}
                        onFocus={() => this.setState({textfield3: true}) } onChangeText={text => this.setState({e_control: text}) }
                        style={{height: 100, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.textfield3 == true ? 'skyblue' : 'gray'}} returnKeyType="none" multiline textAlignVertical="top">             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Precaution:</Text>
                    <TextInput placeholder='Enter Epidermic Precautions (start each line with "#")' onBlur={ () => this.setState({ textfield4: false }) } blurOnSubmit={false}
                        onFocus={() => this.setState({textfield4: true}) } onChangeText={text => this.setState({e_precaution: text}) }
                        style={{height: 100, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.textfield4 == true ? 'skyblue' : 'gray'}} returnKeyType="none" multiline textAlignVertical="top">             
                    </TextInput>

                    <Button title='Submit' type="solid" buttonStyle={{height: 45, marginBottom: 5, marginTop: 30, backgroundColor: 'skyblue'}}
                            onPress={this._submitData} />
                    
                </ScrollView>

                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"  />
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        );
    }

    _renderEClass = ({item}) => (
        <TouchableOpacity onPress={() => this.itemCClass(item) }>
            <Text style={{color: '#fff', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.family} </Text>
        </TouchableOpacity>
    );

    _renderENames = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => this.itemCName(item)} >
                <Text style={{color: '#fff', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.name} Disease </Text>
            </TouchableOpacity>
        );
    }

    _listDivider = () =>{
        return(
            <View style={{height: 1, width: '100%',  backgroundColor: '#fff'}} />
        );
    }

    itemCName(item){
        console.log('name: ' + item.name);
        this.setState({textfield1: false, e_name: item.name});
    }

    itemCClass(item){
        console.log('family: ' + item.family);
        this.setState({textfield2: false, e_class: item.family});
    }

    _submitData = () => {
        //analyse the data submitted before making database communication
        let isValid = this._validateData();
        if(isValid == true){
            //show the progress bar
            this.setState({isLoading: true});

            //try submit the data provided to the database on the cloud
            let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/control/create';
            fetch(url,{
                method: 'POST',
                body: JSON.stringify({
                    epidemic_name: this.state.e_name,
                    epidemic_class: this.state.e_class,
                    epidemic_control: this.state.e_control,
                    epidemic_precaution: this.state.e_precaution
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({isLoading: false});
                console.log(responseJson.message);
                Alert.alert('', responseJson.message);
                if(responseJson.message == 'successfully committed.'){
                    this.forceUpdate();
                }
            })
            .catch(err => {
                this.setState({isLoading: false});
                Alert.alert('',err);
            });
        }
    }

    _validateData(){
        if(this.state.e_name.length == 0){
            Alert.alert(
                '','Enter the Name of Epidemic', [{
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

        if(this.state.e_class.length == 0){
            Alert.alert(
                '','Enter the Class of Epidemic', [{
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

        if(this.state.e_control.length == 0 && this.state.e_precaution.length == 0){
            Alert.alert(
                '','Either the Control or Precaution is needed.', [{
                    text: 'Ok',
                    onPress: () => console.log('control or precaution'),
                    style: 'default'
                }],
                {
                    cancelable: true
                }
            );

            return false;
        }

        return true;
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fff',
        paddingStart: 14,
        paddingEnd: 14
    },

    classmodal: {
        justifyContent: 'flex-start', 
        marginTop: 200, 
        marginStart: 14,
        marginEnd: 14,
        backgroundColor: 'gray',
        borderRadius: 5
    },

    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 120, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    }

});