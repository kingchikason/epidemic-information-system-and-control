import  React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView,
        Modal, ActivityIndicator, DatePickerAndroid, DatePickerIOS, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';


export default class NewFacts extends Component {

    constructor(props){
        super(props);
        this.state = {
            e_name: '',
            e_class: '',
            source: '',
            p_date: '',
            author: '',
            details: '',
            contributors: '',
            textfield1: false,
            textfield2: false,
            textfield3: false,
            textfield4: false,
            textfield5: false,
            textfield6: false,
            textfield7: false,
            isLoading: true,
            epidemicNames: [],
            epidemicClasses: []
        }
    }

    componentDidMount(){
        //do network call to fetch data here
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
                <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingEnd: 14, paddingStart: 14}}>
                    <Text style={{marginTop: 10, color: 'blue', fontSize: 16}}>Create Facts on Epidermic</Text>

                    <Text style={{marginTop: 10}}>Epidermic class:</Text>
                    <TextInput placeholder='Enter Epidermic class' onFocus={() => this.setState({textfield1: true}) } ref='name_input'
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.textfield1 == true ? 'skyblue' : 'gray'}} 
                        returnKeyType="done" >             
                    </TextInput>
                    <Modal visible={this.state.textfield1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                        <View style={styles.familymodal}>
                            <FlatList data={this.state.epidemicNames}
                                renderItem={this._renderENames}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Epidermic Name:</Text>
                    <TextInput placeholder='Enter Epidermic Name' onFocus={() => this.setState({textfield2: true}) }  ref='class_input'
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.textfield2 == true ? 'skyblue' : 'gray'}} returnKeyType="done">             
                    </TextInput>
                    <Modal visible={this.state.textfield2} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['class_input'].blur()} >
                        <View style={styles.classmodal}>
                            <FlatList data={this.state.epidemicClasses}
                                renderItem={this._renderEClass}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Source:</Text>
                    <TextInput placeholder='Enter News Source' onBlur={ () => this.setState({ textfield3: false }) } blurOnSubmit={true} returnKeyType="done"
                        onFocus={() => this.setState({textfield3: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.textfield3 == true ? 'skyblue' : 'gray'}} onChangeText={text => this.setState({source: text}) }  >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Published Date:</Text>
                    <TextInput placeholder='Enter Date Published' onBlur={ () => this.setState({ textfield4: false }) } blurOnSubmit={true}
                        onFocus={ this._showPickDate }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.textfield4 == true ? 'skyblue' : 'gray'}} returnKeyType="done" >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Author:</Text>
                    <TextInput placeholder='Enter authors Name' onBlur={ () => this.setState({ textfield5: false }) } blurOnSubmit={true} onChangeText={text => this.setState({author: text})}
                        onFocus={() => this.setState({textfield5: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.textfield5 == true ? 'skyblue' : 'gray'}} returnKeyType="next" onSubmitEditing={() => this.handlesNext('4')} >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Contributor(s):</Text>
                    <TextInput placeholder='Enter Name of Contributors' onBlur={ () => this.setState({ textfield6: false }) } blurOnSubmit={true} onChangeText={text => this.setState({contributors: text})}
                        onFocus={() => this.setState({textfield6: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.textfield6 == true ? 'skyblue' : 'gray'}} returnKeyType="next" ref='4' onSubmitEditing={() => this.handlesNext('5')} 
                        >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Detail:</Text>
                    <TextInput placeholder='Enter Facts Detail' onBlur={ () => this.setState({ textfield7: false }) } onChangeText={text => this.setState({details: text})}
                        onFocus={() => this.setState({textfield7: true}) }  style={{height: 200, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.textfield7 == true ? 'skyblue' : 'gray'}} returnKeyType="none" ref='5' multiline textAlignVertical="top"
                        >             
                    </TextInput>

                    <Button title='Submit Facts' type="solid" buttonStyle={{marginTop: 25, marginBottom: 15, backgroundColor: 'skyblue'}}
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

    handlesNext = (nxtField) =>{
        this.refs[nxtField].focus();
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
        this.setState({textfield7: false, e_name: item.name});
    }

    itemCClass(item){
        console.log('family: ' + item.family);
        this.setState({textfield8: false, e_class: item.family});
    }

    _showPickDate = () => {
        this.setState({testfield2: true});
        if(Platform.OS == 'android'){
            //open android date picker
            try{
                const {action, year, month, day} = DatePickerAndroid.open({
                    date: new Date()
                });
                if( action !== DatePickerAndroid.dismissedAction){
                    //selected year, month and day here
                    let dt = {day} + '/' + {month} + 1 + '/' + {year};
                    console.log(dt);
                    this.setState({p_date: dt});
                }
                
            }
            catch({code, message}){
                console.warn('can not open datePicker', message);
            }
        }
        else if(Platform.OS == 'ios'){
            //open ios date picker
            return(
                <DatePickerIOS mode="date" 
                    onDateChange={(date) =>{
                        console.log(date);
                    }} />
            );
        }

    }

    _submitData = () =>{
                //analyse the data submitted before making database communication
                let isValid = this._validateData();
                if(isValid == true){
                    //show the progress bar
                    this.setState({isLoading: true});
                    //try submit the data provided to the database on the cloud
                    let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/facts/enterfact';
                    fetch(url,{
                        method: 'POST',
                        body: JSON.stringify({
                            epidemic_name: this.state.e_name,
                            epidemic_class: this.state.e_class,
                            author: this.state.author,
                            contributed: this.state.contributors,
                            published_date: this.state.p_date,
                            source: this.state.source,
                            fact: this.state.details
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({isLoading: false});
                        if(responseJson.message == 'fact created'){
                            Alert.alert('Successfully created.');
                        }
                        else {
                            Alert.alert('Error. Information not created.');
                        }
                    })
                    .catch(err => {
                        this.setState({isLoading: false});
                        Alert.alert(err);
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

        if(this.state.author.length == 0){
            Alert.alert(
                '','Enter the Editor/Author of the Material', [{
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

        if(this.state.p_date.length == 0){
            Alert.alert(
                '','Enter the published date of the Material.', [{
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

        return true;
    }
}

const styles = StyleSheet.create({
    btn_ok: {
        borderRadius: 5,
        backgroundColor: 'skyblue',
        marginTop: 35,
        height: 45,
        marginBottom: 15,
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