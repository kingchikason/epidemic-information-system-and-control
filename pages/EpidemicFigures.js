import React, { Component } from 'react';
import { View,Text, TextInput, FlatList, StyleSheet, SectionList, Alert, ActivityIndicator} from 'react-native';
import { Header, Icon, Button} from 'react-native-elements';
import Modal from 'react-native-modal';
//import NativeAdView from 'react-native-admob-native-ads';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Banner} from 'react-native-ad-manager';


export default class EpidemicFigures extends Component {
    constructor(props){
        super(props);
        this.state = {
            txt1: false,
            isLoading: true,
            loaded: false,
            info: '',
            e_name: '',
            epidemicClasses: [],
            epidemicNames: [],
            figures_data: []
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
            this._loadEFigures('none', 'all');
        })
        .catch((error) => {
            //closes the progress loading
            //this.setState({isLoading: false});
            this._loadEFigures('none', 'all');
            console.log('failed to load data');
        });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'Epidemic Regions And Figures', style:{color: '#fff'} }} >
                </Header>
                <TouchableOpacity onPress={() => this.setState({txt1: true})}>
                    <View style={{flexDirection: 'row', height: 45, borderColor: 'gray', borderWidth: 1, borderRadius: 5,
                        padding: 10, marginStart: 5, marginEnd: 5, marginTop: 2}}>
                            <Icon name='search' color='gray' />
                            <Text style={{color: 'gray', marginStart: 10, paddingTop: 3}}>Search Epidemic</Text>
                    </View>
                </TouchableOpacity>
                <Modal isVisible={this.state.txt1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} 
                    backdropOpacity={0.3} backdropColor={'black'} onBackdropPress={() => this.setState({txt1: false})} 
                    onBackButtonPress={() => this.setState({txt1: false})} >
                        <View style={styles.familymodal}>
                            <FlatList data={this.state.epidemicNames}
                                renderItem={this._renderENames}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider}
                                />
                        </View>
                </Modal>

                <Text style={{fontSize: 18, fontWeight: 'normal', color: 'black', marginTop: 3}}>{this.state.info}</Text>


                <SectionList 
                    sections={this.state.figures_data}
                    renderSectionHeader={({section: {title}}) => (
                        <View style={{flex: 1, justifyContent: 'center', alignContent: 'flex-start', 
                                marginTop: 15}} >
                            <View style={{flex: 1, flexDirection: 'row', alignContent: 'space-between', backgroundColor: 'gray', paddingTop: 15, paddingBottom: 5}}>
                                <Text style={{color: 'white', fontSize: 21, fontWeight: 'bold', paddingStart: 12, width: 250}} >{title}</Text>
                                <Button title='See All' type='outline' buttonStyle={{paddingBottom: 0, paddingTop: 0, marginStart: 32 }} 
                                titleStyle={{color: 'blue'}} onPress={() => this._viewByRegion(title)} />
                            </View>
                            
                            <View style={{height: 1, width: '100%', backgroundColor: 'black'}} />

                            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'gray'}} >
                                <View style={{width: '35%', justifyContent: 'center', paddingStart: 10,  paddingTop: 2, paddingBottom: 2}}>
                                    <Text style={{fontSize: 12, color: 'white'}}>country</Text>
                                </View>

                                <View style={{width: '15%', justifyContent: 'center', alignItems: 'center',  paddingTop: 2, paddingBottom: 2}}>
                                    <Text style={{fontSize: 12, color: 'white'}} > total case</Text>
                                </View>

                                <View style={{width: '15%', justifyContent: 'center', alignItems: 'center', paddingTop: 2, paddingBottom: 2}}>
                                    <Text style={{fontSize: 12, color: 'white'}} >recovered</Text>
                                </View>
                                
                                <View style={{width: '15%', justifyContent: 'center', alignItems: 'center', paddingTop: 2, paddingBottom: 2}}>
                                    <Text style={{fontSize: 12, color: 'white'}} > death</Text>
                                </View>
                                                                    
                                <View style={{width: '15%', justifyContent: 'center', alignItems: 'center', paddingTop: 2, paddingBottom: 2}}>
                                    <Text style={{fontSize: 12, color: 'white'}} > last modified</Text>
                                </View>     

                            </View>
                        </View>
                    ) }
                    renderItem={this._renderFigureList}
                    keyExtractor={(item, index) => item + index}
                    ListHeaderComponent={this._renderNativeAds(this.state.loaded)}
                    ListFooterComponent={this._renderNativeAds(this.state.loaded)}
                    />


                <Modal isVisible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} backdropColor={'black'}
                        backdropOpacity={0.3} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large"  />
                    </View>
                </Modal>

            </View>
        );
    }

    itemCName(item){
        console.log('name: ' + item.name);
        this.setState({textfield7: false, e_name: item.name});
    }

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
 
    _loadEFigures = (ename, reg) => {
        //loads the figures
        let url = `https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/figures/fetch?filter=${ename}&area=${reg}`;
        fetch(url, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({isLoading: false, info: responseJson.info});
            this._prepareData(responseJson);
        })
        .catch(err => {
            console.log(err);

            this.setState({isLoading: false});
            Alert.alert('', err.message);
        });
    }

    _prepareData = (rdata) =>{
        let am = rdata.america;
        let af = rdata.africa;
        let as = rdata.asia;
        let eu = rdata.europe;
        let all_data = [];

        for(let i = 0; i < 4; i++){
            if(i == 0 && af.length >= 1){
                all_data.push({
                    'title': 'Africa',
                    'data': af
                });
            }
            else if(i == 1 && am.length >= 1){
                all_data.push({
                    'title': 'America',
                    'data': am
                });
            }
            else if(i == 2 && as.length >= 1){
                all_data.push({
                    'title': 'Asia',
                    'data': as
                });
            }
            else if(i == 3 && eu.length >= 1){
                all_data.push({
                    'title': 'Europe',
                    'data': eu
                });
            }
        }
        this.setState({figures_data: all_data, loaded: true});
    }

    _renderFigureList = ({item}) =>{
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'row'}} >
                    <View style={{width: '35%', justifyContent: 'center', paddingStart: 10,  paddingTop: 5, paddingBottom: 5}}>
                        <Text >{item.country}</Text>
                    </View>
                    <View style={{height: '100%', width: 1, backgroundColor: 'gray'}} />

                    <View style={{width: '15%', justifyContent: 'center', alignItems: 'center',  paddingTop: 5, paddingBottom: 5}}>
                        <Text style={{fontSize: 12}} >{item.total_case}</Text>
                    </View>
                    <View style={{height: '100%', width: 1, backgroundColor: 'gray'}} />

                    <View style={{width: '15%', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5}}>
                        <Text style={{fontSize: 12, color: 'green'}} >{item.total_recovered}</Text>
                    </View>
                    <View style={{height: '100%', width: 1, backgroundColor: 'gray'}} />
                    
                    <View style={{width: '15%', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5}}>
                        <Text style={{fontSize: 12, color: 'red'}} >{item.total_death}</Text>
                    </View>
                    <View style={{height: '100%', width: 1, backgroundColor: 'gray'}} />

                    
                    <View style={{width: '19%', justifyContent: 'center', alignItems: 'center',  paddingTop: 5, paddingBottom: 5}}>
                        <Text style={{fontSize: 12}}>{item.date}</Text>
                        <Text style={{fontSize: 12}}>{item.time}</Text>
                    </View>

                </View>
                <View style={{height: 1, backgroundColor: 'gray', width: '100%' }} />
            </View>
        );
    }

    _renderNativeAds = (loaded) =>{
        if(loaded){
            return(
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Banner
                        adSize='smartBanner'
                        adUnitID="ca-app-pub-9133642311191277/8195639276"
                        onAdFailedToLoad={error => console.log(error)}
                        onAppEvent={event => console.log(event.name, event.info)}
                        />
                </View>
            );
        }
    }

    _viewByRegion = (title) =>{
        this.setState({isLoading: true});
        if(this.state.e_name.length == 0)
            this._loadEFigures('none', title);
        else
            this._loadEFigures(this.state.e_name, title);
    }
};

const styles = StyleSheet.create({
    familymodal: {
        justifyContent: 'flex-start', 
        //marginTop: 100, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'white',
        borderRadius: 5
    },


});