import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, FlatList} from 'react-native';
import { Header, Icon } from 'react-native-elements'

class Articles extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            epidemicNames: [],
            articles_data: []
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
            //loads the initial/latest precaution
            this._loadArticles('All');
        })
        .catch((error) => {
            //closes the progress loading
            //this.setState({isLoading: false});
            this._loadArticles('All');
            console.log('failed to load data');
        });
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <Header placement="left" 
                        containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                        leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                        centerComponent={{ text: 'ARTICLES AND PUBLICATIONS ON EPIDEMICS', style:{color: '#fff'} }} >
                    </Header>

                    <TextInput placeholder='Filter Articles' onFocus={() => this.setState({txt1: true}) } 
                    style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 1, 
                    borderColor: this.state.txt1 == true ? 'skyblue' : 'gray', marginStart: 5, marginEnd: 5, marginTop: 4}} returnKeyType="none" ref='name_input'>             
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
                    
                    <FlatList
                            data={this.state.articles_data}
                            renderItem={this._readItemContainer}
                            keyExtractor={(item, index) => item + index }
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
        this.setState({txt1: false, isLoading: true});
        let v = item.name;
        this._loadArticles(v);
    }

    _loadArticles = (filter) => {
        //fetch the articles
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/article/articles';
        fetch(url, { method: 'GET'})
                .then((response) => response.json())
                .then((responseJson) => {
                    let data = responseJson.data;
                    this.setState({articles_data: data, isLoading: false});
                })
                .catch(err => {
                    this.setState({isLoading: false});
                });
    }

    _readItemContainer = ({item}) =>{
        return(
            <TouchableHighlight onPress={() => this._viewArticle()}>
                <View style={styles.itemCont}>
                    <Text style={styles.txtTitle}>{item.title}
                    </Text>               
                    <Text style={{marginTop: 3, color: 'gray', fontSize: 16, fontWeight: 'normal'}}>
                        Publication on {item.epidemic_name}  
                        By {item.author}
                        Date: {item.published_date}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _viewArticle = () => {

    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 100, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    },

    itemCont: {
        flex: 1, 
        justifyContent: 'flex-start', 
        borderColor: 'gray', 
        borderRadius: 5, 
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        marginBottom: 5
    },

    txtTitle: { 
        color: 'black', 
        fontSize: 18, 
        fontWeight: 'bold', 
        justifyContent: 'center'
    },

});

export default Articles;