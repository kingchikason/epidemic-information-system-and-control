import React,{ Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, ScrollView,
            Modal, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class AddPublication extends Component {
    constructor(props){
        super(props);
        this.state = {
            e_name: '',
            e_class: '',
            author: '',
            title: '',
            source: '',
            published_date: '',
            detail: '',
            reference: '',
            txt1: false,
            txt2: false,
            txt01: false,
            isLoading: true,
            epidemicNames: [],
        }
    }

    componentDidMount(){
        //do the initial network operation here
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
            Alert.alert('', error.message);
        });
    }

    render(){
        return(
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}} behavior={Platform.OS === 'ios' ? 'padding' : null} >
            <ScrollView style={styles.body}>
                <Text style={{marginTop: 15, fontSize: 16, color: 'blue'}}>
                    Submit an Publication on Epidemic disease
                </Text>

                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Epidemic Name:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter Epidemic Name' onFocus={() => this.setState({txt1: true}) }  
                    style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 2, 
                    borderColor: this.state.txt1 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_name} ref='name_input'>             
                </TextInput>
                <Modal visible={this.state.txt1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                    <View style={styles.familymodal}>
                        <FlatList data={this.state.epidemicNames}
                            renderItem={this._renderENames}
                            keyExtractor={(item, index) => index.toString() }
                            ItemSeparatorComponent={this._listDivider} />
                    </View>
                </Modal>

                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Epidemic Class:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter Epidemic class' onFocus={() => this.setState({txt2: true})}
                    style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, 
                    borderColor: this.state.txt2 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_class} ref='class_input'>             
                </TextInput>
                <Modal visible={this.state.txt2} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['class_input'].blur()} >
                    <View style={styles.classmodal}>
                        <FlatList data={this.state.epidemicClasses}
                            renderItem={this._renderEClass}
                            keyExtractor={(item, index) => index.toString() }
                            ItemSeparatorComponent={this._listDivider} />
                    </View>
                </Modal>

                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Published Date:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter Date Published' onFocus={() => this.setState({txt01: true}) }  
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.txt01 == true ? 'skyblue' : 'gray'}} returnKeyType="done" ref='2' value={this.state.published_date} >             
                </TextInput>
                <View>
                    { this.state.txt01 &&
                    (<DateTimePicker timeZoneOffsetInMinutes={0} value={new Date()} 
                        is24Hour={true} onChange={(event, date) => this.setPDate(event, date) }/>
                    )}
                </View>

                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Title:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter the Title of the Article' returnKeyType="none" onBlur={()=> this.setState({txt3: false})} 
                        onFocus={() => this.setState({txt3: true})} onChangeText={text => this.setState({title: text})} multiline textAlignVertical="top"
                        style={{height: 100, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.txt3 ? 'skyblue' : 'gray'}} >                       
                </TextInput>

                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Detail Write-ups:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter the introductory part or the body if no introductory part' returnKeyType='none' onBlur={()=> this.setState({txt5: false})} multiline
                        onFocus={() => this.setState({txt5: true})} onChangeText={text => this.setState({detail: text})} textAlignVertical='top'
                        style={{height: 200, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.txt5 ? 'skyblue' : 'gray'}} >                       
                </TextInput>


                <View style={styles.rowCon}><Text style={{marginTop: 10}}>Author:</Text><Text style={styles.txtrequired}> *</Text></View>
                <TextInput placeholder='Enter the authors of the work here(Note: start/mark each author with "#" )' returnKeyType='none' onBlur={()=> this.setState({txt11: false})} 
                        onFocus={() => this.setState({txt11: true})} onChangeText={text => this.setState({author: text})} textAlignVertical='top' multiline
                        style={{height: 100, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.txt11 ? 'skyblue' : 'gray'}} >                       
                </TextInput>


                <Text style={{marginTop: 10}}>Source:</Text>
                <TextInput placeholder='Enter the Source' returnKeyType='none' onBlur={()=> this.setState({txt15: false})}
                        onFocus={() => this.setState({txt15: true})} onChangeText={text => this.setState({source: text})}
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.txt15 ? 'skyblue' : 'gray'}} >                       
                </TextInput>


                <Text style={{marginTop: 10}}>Reference:</Text>
                <TextInput placeholder='Enter the references (Note: start/mark each reference with "#" )' returnKeyType='none' onBlur={()=> this.setState({txt13: false})} 
                        onFocus={() => this.setState({txt13: true})} onChangeText={text => this.setState({reference: text})} textAlignVertical='top' multiline
                        style={{height: 100, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, borderColor: this.state.txt13 ? 'skyblue' : 'gray'}} >                       
                </TextInput>

                <Button title='Submit Your Article' buttonStyle={styles.btnSubmit}
                        onPress={this._submitData}/>

            </ScrollView>

            <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
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
        this.setState({txt1: false, e_name: item.name});
    }

    itemCClass(item){
        this.setState({txt2: false, e_class: item.family});
    }

    _submitData = () =>{
        this.setState({isLoading: true});
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/publication/create';
        //verify and validate the provided data
        let isValid = this._validateData();
        if(isValid == true){
            //continue with the submition of the article 
            fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        title: this.state.title,
                        author: this.state.author,
                        epidemic_name: this.state.e_name,
                        epidemic_class: this.state.e_class,
                        published_date: this.state.published_date,
                        reference: this.state.reference,
                        source: this.state.source,
                        detail: this.state.detail
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading: false});
                    Alert.alert('', responseJson.message);
                })
                .catch(err => {
                    this.setState({isLoading: false});
                    Alert.alert('', err.message);
                });
        }
    }

    _validateData = () => {
        //checks the provided input for corespondency
        if(this.state.e_class.length == 0){
            Alert.alert('','Enter Epidemic Class');
            return false;
        }

        if(this.state.e_name.length == 0){
            Alert.alert('','Enter Epidemic Name');
            return false;
        }

        if(this.state.author.length == 0){
            Alert.alert('','Enter the Author');
            return false;
        }

        if(this.state.title.length == 0){
            Alert.alert('','Enter publication title');
            return false;
        }


        if(this.state.published_date.length == 0){
            Alert.alert('','Enter published date');
            return false;
        }

        return true;
    }

    setPDate = (event, date) =>{
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let dt = day + '/' + month + '/' + year;
        //set the published date now
        this.setState({published_date: dt, txt01: false});
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingStart: 14,
        paddingEnd: 14,
    },

    btnSubmit: {
        borderRadius: 5,
        height: 45,
        marginTop: 25,
        marginBottom: 15,
        backgroundColor: 'skyblue'
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
    },

    rowCon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },

    txtrequired: {
        color: 'red',
        marginTop: 10
    }
});
