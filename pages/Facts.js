import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ActivityIndicator, FlatList,
         TouchableHighlight, TouchableOpacity} from 'react-native';
import { Header, Icon, Button} from 'react-native-elements';

class Facts extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            txt1: false,
            epidemicNames: [],
            epidemicClasses: [],
            facts_data:[],
            e_name: '',
        }
    }

    componentDidMount(){
            //fetch the network data here
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
                // this.setState({isLoading: false});
                //load the initial facts
                this._loadFacts('none');
            })
            .catch((error) => {
                //closes the progress loading
                this.setState({isLoading: false});
                console.log('failed to load data');
            });
    }

    render(){

        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'FACTS ON EPIDEMICS', style:{color: '#fff'} }} >
                </Header>
                <TextInput placeholder='Choose Epidemic' onFocus={() => this.setState({txt1: true}) }  
                    style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 2, marginStart: 10, marginEnd: 10, marginTop: 4,
                    borderColor: this.state.txt1 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_name} ref='name_input'>             
                </TextInput>
                <Modal visible={this.state.txt1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                    <View style={styles.familymodal}>
                        <FlatList data={this.state.epidemicNames}
                            renderItem={this._renderENames}
                            keyExtractor={(item, index) => index.toString() }
                            ItemSeparatorComponent={this._listDivider}
                             />
                    </View>
                </Modal>


                <FlatList   style={{marginTop: 10}}
                        data={this.state.facts_data}
                        renderItem={this._renderFactsItem}
                        keyExtractor={(item, index) => index.toString() } 
                         />

            </View>
        );
    }

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
        this.setState({txt1: false, e_name: item.name, isLoading: true});
        let v = item.name;
        this._loadFacts(v);
    }

    _loadFacts = (name) => {
        //get the facts of the epidemic
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/facts/fetch?filter=' + name;
        fetch(url,{ method: 'GET'}).then((response) => response.json())
                .then((responseJson) => {
                    let rsp = responseJson.data;
                    this.setState({isLoading: false, facts_data: rsp});
                })
                .catch(err => {
                    this.setState({isLoading: false});
                    if(name != 'none'){
                        Alert.alert('', 'no fact available for this epidemic');
                    }
                });
    }

    _renderFactsItem = ({item}) => {
        return(
            <View style={styles.itemcon}>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', marginTop: 5}}>
                    {item.title}
                </Text>
                <Text style={{color: 'blue', fontSize: 14, fontWeight: 'normal', marginTop: 5}}>
                    By {item.author}
                </Text>
                <Text style={{color: 'gray', fontSize: 14, fontWeight: 'normal', marginTop: 3}}>
                  Recorded On {item.published_date}
                </Text>

                <Text style={{fontSize: 16, fontWeight: 'normal', marginTop: 8}}>
                    {item.detail}
                </Text>

                <Text style={{fontSize: 14, fontWeight: 'normal', marginTop: 10}}>
                    {item.contributor}
                </Text>
                <Text style={{color: 'blue' ,fontSize: 14, fontWeight: 'normal', marginTop: 10}}>
                    {item.source}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

    top_view: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10,
        marginStart: 14,
        marginEnd: 14
    },

    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 140, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    },

    itemcon: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 6,
        marginBottom: 6,
        padding: 10,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1
    },


});

export default Facts;