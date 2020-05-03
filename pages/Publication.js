import React,{ Component } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, 
             ActivityIndicator, TouchableOpacity } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Banner } from 'react-native-ad-manager';

export default class Publication extends Component {
    constructor(props){
        super(props);
        this.state = {
            txt1: false,
            isLoading: true,
            epidemicNames: [],
            epidemicClasses: [],
            publicationData: []
        }
    }

    componentDidMount(){
        console.log('component mounted');
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
            this._loadPublications('All');
        })
        .catch((error) => {
            //closes the progress loading
            this._loadPublications('All');
        });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'Publications on Epidemics', style:{color: '#fff'} }} >
                </Header>
                
                <TouchableOpacity onPress={() => this.setState({txt1: true})}>
                    <View style={{flexDirection: 'row', height: 45, borderColor: 'gray', borderWidth: 1, borderRadius: 5,
                        padding: 10, marginStart: 5, marginEnd: 5, marginTop: 2}}>
                            <Icon name='search' color='gray' />
                            <Text style={{color: 'gray', marginStart: 10, paddingTop: 3}}>Filter By Epidemic</Text>
                    </View>
                </TouchableOpacity>
                <Modal isVisible={this.state.txt1} presentationStyle="overFullScreen" transparent={true} 
                        style={{flex: 1}} onBackdropPress={() => this.setState({txt1: false})} backdropColor={'black'}
                        backdropOpacity={0.3} >
                    <View style={styles.familymodal}>
                        <FlatList data={this.state.epidemicNames}
                            renderItem={this._renderENames}
                            keyExtractor={(item, index) => index.toString() }
                            ItemSeparatorComponent={this._listDivider}
                             />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingEnd: 14, marginTop: 5}}>
                        <Button title='Cancel' buttonStyle={{width: 150, borderRadius: 5, backgroundColor: 'gray'}} type='solid'
                                onPress={() => this.setState({txt1: false})} />
                    </View>
                </Modal>

                <FlatList data={this.state.publicationData}
                        renderItem={this.renderPublication}
                        keyExtractor={(item, index) => index.toString() }
                        />

                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large"  />
                    </View>
                </Modal>
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
        this.setState({txt1: false, e_name: item.name});
        this._loadPublications(item.name);
    }

    renderPublication = ({item}) =>{
        return(
            <>
            <TouchableOpacity onPress={() => this.viewPublication(item)} >
                <View style={{marginTop: 8, marginBottom: 8, paddingTop: 5, paddingBottom: 5, paddingStart: 8, marginStart: 10, marginEnd: 10, elevation: 1, borderRadius: 5}}>
                    <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
                        {item.title}
                    </Text>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: 'normal'}}>
                        Published by {item.author}
                    </Text>
                    { item.source.length > 2 && 
                    (<Text style={{fontSize: 16, color: 'gray', fontWeight: 'normal'}}>
                        {item.source}
                    </Text>)
                    }
                    <Text style={{fontSize: 16, color: 'gray', fontWeight: 'normal'}}>
                        Date: {item.published_date}
                    </Text>
                </View>
            </TouchableOpacity>
            { (item.serial_no%9 == 2 ) && (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
                    <Banner
                        adSize='largeBanner'
                        adUnitID="ca-app-pub-9133642311191277/8195639276"
                        //testDevices={[PublisherBanner.simulatorId]}
                        onAdFailedToLoad={error => console.log(error)}
                        onAppEvent={event => console.log(event.name, event.info)}
                        />
                </View>  
            )
            }
            </>
        );
    }

    _loadPublications = (eName) =>{
        //load the publication from the database
        let url = `https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/publication/fetch?filter=${eName}`;
        fetch(url, {
                method: 'GET',
            })
            .then((response) => response.json())
            .then((responseJson) => {
                let data = responseJson.data;
                this.setState({publicationData: data, isLoading: false});
            })
            .catch(error =>{
                this.setState({isLoading: false});
                Alert.alert('','error loading data. try again!')
            });
    }

    viewPublication = (item) => {
        //navigates to the publication item view page
        this.props.navigation.navigate('ViewPub',{title: item.title, author: item.author,
                source: item.source, detail: item.detail,
                 date: item.published_date});
    }

    hidesPup = () => {
        console.log('hidding you')
        this.setState({txt1: false});
    }

    _renderNativeAds2 = (isLoaded) =>{
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
                <Banner
                    adSize='largeBanner'
                    adUnitID="ca-app-pub-9133642311191277/8195639276"
                    //testDevices={[PublisherBanner.simulatorId]}
                    onAdFailedToLoad={error => console.log(error)}
                    onAppEvent={event => console.log(event.name, event.info)}
                    />
             </View>  
        );         
}
}

const styles = StyleSheet.create({
    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 100, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    },



});