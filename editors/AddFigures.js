import React,{ Component } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, ScrollView, FlatList,
         ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { Picker } from '@react-native-community/picker';
import Modal from 'react-native-modal';
import { Button, Icon} from 'react-native-elements';

export default class AddFigures extends Component {
    constructor(props){
        super(props);
        let ph = this.props.route.params.phone;
        let nm = this.props.route.params.name;
        this.state = {
            isLoading: true,
            epidemicNames: [],
            epidemicClasses: [],
            region: 'Africa',
            e_class: '',
            e_name: '',
            country: '',
            number_death: '',
            number_recovered: '',
            total_number: '',
            editor: nm
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
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingStart: 14, paddingEnd: 14}} >

                    <Text style={{marginTop: 10}}>Epidemic Name:</Text>
                    <TextInput placeholder='Enter Epidemic Name' onFocus={() => this.setState({textfield7: true}) }  
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 2, 
                        borderColor: this.state.textfield7 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_name} ref='name_input'>             
                    </TextInput>
                    <Modal isVisible={this.state.textfield7} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()}
                            backdropColor={'black'} backdropOpacity= {0.3} onBackdropPress={() => this.setState({textfield7: false})} >
                        <View style={styles.familymodal}>
                            <FlatList data={this.state.epidemicNames}
                                renderItem={this._renderENames}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Epidemic class:</Text>
                    <TextInput placeholder='Enter Epidemic class' onFocus={() => this.setState({textfield8: true})}
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, 
                        borderColor: this.state.textfield8 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_class} ref='class_input'>             
                    </TextInput>
                    <Modal isVisible={this.state.textfield8} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['class_input'].blur()}
                            backdropColor={'black'} backdropOpacity={0.4} onBackdropPress={() => this.setState({textfield8: false})} >
                        <View style={styles.classmodal}>
                            <FlatList data={this.state.epidemicClasses}
                                renderItem={this._renderEClass}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Region:</Text>
                    <View style={{borderRadius: 5, borderColor: 'gray',borderWidth: 1, justifyContent: 'center', alignContent: 'stretch'}}>
                        <Picker style={{borderColor: 'gray', borderWidth: 1, borderRadius: 5,}} selectedValue={this.state.region}
                            onValueChange={(item, index) => this.setState({region: item}) }>
                            <Picker.Item  label='Africa' value='Africa' />
                            <Picker.Item  label='America' value='America' />
                            <Picker.Item  label='Asia' value='Asia' />
                            <Picker.Item  label='Europe' value='Europe' />
                            <Picker.Item  label='Artantic' value='Artantic' />
                        </Picker>
                    </View>

                    <Text style={{marginTop: 10}}>Country:</Text>
                    <TextInput placeholder='Enter Country involved' onBlur={ () => this.setState({ testfield3: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield3: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield3 == true ? 'skyblue' : 'gray'}} returnKeyType="done"
                            onChangeText={text => this.setState({country: text})} >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Total Cases:</Text>
                    <TextInput placeholder='Enter the total number of epidemic case' onBlur={ () => this.setState({ testfield4: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield4: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield4 == true ? 'skyblue' : 'gray'}} returnKeyType="done" keyboardType='numeric'
                            onChangeText={text => this.setState({total_number: text})} >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Number Recovered:</Text>
                    <TextInput placeholder='Enter the total number of people recovered' onBlur={ () => this.setState({ testfield5: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield5: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield5 == true ? 'skyblue' : 'gray'}} returnKeyType="done" keyboardType='numeric'
                            onChangeText={text => this.setState({number_recovered: text})} >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Number Died:</Text>
                    <TextInput placeholder='Enter the total number of people died on the epidemic' onBlur={ () => this.setState({ testfield6: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield6: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield6 == true ? 'skyblue' : 'gray'}} returnKeyType="done" keyboardType='numeric'
                            onChangeText={text => this.setState({number_death: text})} >             
                    </TextInput>

                    <Button title="Submit Update" buttonStyle={styles.button1} titleStyle={{color: 'green'}} type='outline' onPress={this._updateFigures} />
                    <Button title="Submit New" buttonStyle={styles.button2} titleStyle={{color: 'white'}} type='solid' onPress={this._newFigures} />
                </ScrollView>

                <Modal isVisible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} backdropOpacity={0.4}
                        backdropColor={'black'} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"  />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        )
    }

    itemCName(item){
        console.log('name: ' + item.name);
        this.setState({textfield7: false, e_name: item.name});
    }

    itemCClass(item){
        console.log('family: ' + item.family);
        this.setState({textfield8: false, e_class: item.family});
    }

    _renderEClass = ({item}) => (
        <TouchableOpacity onPress={() => this.itemCClass(item) }>
            <Text style={{color: 'black', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.family} </Text>
        </TouchableOpacity>
    );

    _renderENames = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => this.itemCName(item)} >
                <Text style={{color: 'black', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.name} Disease </Text>
            </TouchableOpacity>
        );
    }

    _listDivider = () =>{
        return(
            <View style={{height: 1, width: '100%',  backgroundColor: 'gray'}} />
        );
    }

    _updateFigures = () =>{
        //updates an existing epidemic figures
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/figures/updates';
        let isValid = this._validateData();

        if(isValid == true){
            //shows the progress bar
            this.setState({isLoading: true});

            fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    ename: this.state.e_name,
                    eclass: this.state.e_class,
                    total_case: this.state.total_number,
                    death_case: this.state.number_death,
                    recovered_case: this.state.number_recovered,
                    region: this.state.region,
                    country: this.state.country,
                    editor: this.state.editor
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({isLoading: false});
                Alert.alert('', responseJson);
            })
            .catch(err =>{
                console.log(err);

                this.setState({isLoading: false});
                Alert.alert('', err.message);
            });
        }
    }

    _newFigures = () =>{
        //creates new epidemic figure
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/figures/enter';
        let isValid = this._validateData();

        if(isValid == true){
            //shows the progress bar
            this.setState({isLoading: true});
        
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    ename: this.state.e_name,
                    eclass: this.state.e_class,
                    total_case: this.state.total_number,
                    death_case: this.state.number_death,
                    recovered_case: this.state.number_recovered,
                    region: this.state.region,
                    country: this.state.country,
                    editor: this.state.editor
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({isLoading: false});
                Alert.alert('', responseJson);
            })
            .catch(err =>{
                console.log(err);

                this.setState({isLoading: false});
                Alert.alert('', err.message);
            });
        }
    }

    _validateData = () =>{
        //makes sure the country is not empty
        if(this.state.country.length == 0){
            Alert.alert('', 'enter the country.');
            return false;
        }
        //makes sure the region is not empty
        if(this.state.region.length == 0){
            Alert.alert('', 'choose the region.');
            return false;
        }
        //makes sure the total number of affected people
        if(this.state.total_number.length == 0){
            Alert.alert('', 'enter total number of case');
            return false;
        }
        //makes sure the number of the recovered cases is not empty 
        if(this.state.number_recovered.length == 0){
            Alert.alert('', 'enter the recovered number');
            return false;
        }
        //makes sure the number of the death cases is not empty
        if(this.state.number_death.length == 0){
            Alert.alert('', 'enter the death cases');
            return false;
        }
        //makes sure the epidemic class is not empty
        if(this.state.e_class.length == 0){
            Alert.alert('', 'enter the epidemic class');
            return false;
        }
        //makes sure the epidemic name is not empty
        if(this.state.e_name.length == 0){
            Alert.alert('', 'enter the epidemic name');
            return false;
        }

      return true;
    }

};

const styles = StyleSheet.create({
    classmodal: {
        justifyContent: 'flex-start', 
        //marginTop: 200, 
        marginStart: 14,
        marginEnd: 14,
        backgroundColor: 'white',
        borderRadius: 5
    },

    familymodal: {
        justifyContent: 'flex-start', 
       // marginTop: 120, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'white',
        borderRadius: 5
    },

    button1: {
        width: '100%',
        height: 45,
        marginTop: 40,
        borderRadius: 5,
        borderColor: 'green',
        borderWidth: 0.8,
    },

    button2: {
        width: '100%',
        height: 45,
        marginTop: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        borderWidth: 0,
        marginBottom: 15
    }

});