import React, {Component} from 'react';
import { View, Text, StyleSheet, SectionList, Image, Platform,
     Alert, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Header, Icon} from 'react-native-elements';
import { Banner} from 'react-native-ad-manager';
import { AdMobBanner } from 'react-native-admob';


class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            loaded: false,
            isRefreshing: false,
            isSuccess: false,
            country: '',
            region: '',
            news_nearest: [],
            news_region: [],
            news_global: [],
            news_data: []
        }

    }

    componentDidMount(){
        //fetch location 
        let addr = 'http://api.ipstack.com/check?access_key=da28b9a10e5c09d08c694e5abd6e9e82';
        fetch(addr, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let rg = responseJson.continent_name;
            let ct = responseJson.country_name;
            this.setState({country: ct, region: rg});
            this._loadData(rg, ct);
        })
        .catch(err =>{
            this._loadData('','');
        });

    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" type="fontawesome" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'World Epidemic latest news and Info.', style:{color: '#fff'} }}>
                </Header>

                <SectionList   
                    sections={this.state.news_data}
                    renderItem={this.renderItemList}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={({section: {title}}) => (
                        <View style={{flex: 1, justifyContent: 'center', alignContent: 'flex-start', 
                                marginTop: 15}} >
                            <Text style={{color: 'gray', fontSize: 16, fontWeight: 'bold', paddingStart: 12, width: 250}} >{title}</Text>
                        </View>
                    ) }
                    ListHeaderComponent={() => this._renderNativeAds(this.state.loaded)}
                    renderSectionFooter={() =>this._renderNativeAds2(this.state.loaded)}
                    onRefresh={() =>{
                        this.setState({isRefreshing: true})
                        this._loadData(this.state.region, this.state.country)
                    }}
                    refreshing={this.state.isRefreshing}
                    />

                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large"  />
                    </View>
                </Modal>
            </View>
        );
    }  

    renderItemList = ({item}) => {
        return(
            <TouchableOpacity onPress={() => this._openNewsView(item)} > 
                <View style={styles.itemview}>
                    <View style={styles.text_con} >
                        <Text style={styles.itemText} numberOfLines={3} ellipsizeMode='tail'>
                            {item.title}
                        </Text>
                        <View style={styles.text_view2} >
                            <Text style={{color: 'gray', fontSize: 12}} >{item.source}</Text>
                            <Text style={{color: 'gray', fontSize: 12, paddingEnd: 5}} >{item.published_date}</Text>
                        </View>
                    </View>
                    <Image source={{uri: item.media_url_one}} style={{width: '44%', height: '100%', borderTopRightRadius: 5, borderBottomRightRadius: 5} } />
                </View>
            </TouchableOpacity>
        );
    }

    _renderDivider = () => {
        return(
            <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}/>
        );
    }

    _loadData = (region, country) => {
                console.log('region: '+ region + '  country: ' + country);
                //try make a network connection here
                let url = '';
                if(region.length > 1 && country.length > 1){
                    url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/fetch?region=' + region + '&country=' + country;
                    console.log('url: ' + url);
                }
                else{
                    url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/fetch';
                }

                fetch(url,{
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading: false, isSuccess: true, isRefreshing: false});
                    if(responseJson.code == 200){
                        let data_nearest = responseJson.nearest;
                        let data_region = responseJson.region;
                        let data_global = responseJson.global;
                        //commit the data to the UI View
                        this.setState({news_nearest: data_nearest, news_region: data_region, news_global: data_global, loaded: true}) ; 
                        this._prepareData(data_nearest, data_region, data_global);  
                    }
                    else{
                        Alert.alert('', 'failed fetching data');
                    }
                })
                .catch(err => {
                    this.setState({isLoading: false, isSuccess: false, isRefreshing: false});
                    Alert.alert('', err.message);
                });
    }

    _prepareData(loc, reg, glo){
        let all_news;
        if(loc.length > 0 && reg.length > 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Latest on Epidemic in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Epidemics Highlights in ' + this.state.region, //for the region
                    'data': reg
                },
                {
                    'title': 'Global News Highlights on Epidemics',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length == 0 && reg.length > 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                },
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news}); 
        }
        else if(loc.length == 0 && reg.length == 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length == 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Latest on Epidemic in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ]

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length == 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'Latest on Epidemic in ' + this.state.country, //for the country location
                     'data': loc
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length == 0 && reg.length > 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length > 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'Latest on Epidemic in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                }
            ];

            this.setState({news_data: all_news});
        }
    }

    _openNewsView = (item) =>{
        this.props.navigation.navigate('NewsView',{title: item.title, body: item.detail, date: item.published_date, 
                    url_one: item.media_url_one, region: item.region, url_two: item.media_url_two, id: item.serial_no});
    }

    _renderNativeAds = (isLoaded) =>{
            return(
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Banner
                        adSize='smartBanner'
                        adUnitID="ca-app-pub-9133642311191277/8195639276"
                        onAdFailedToLoad={error => console.log(error)}
                        onAppEvent={event => console.log(event.name, event.info)}
                        />
                </View>
            );
    }

    _renderNativeAds2 = (isLoaded) =>{
            return(
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                    <AdMobBanner
                        adSize='largeBanner'
                        adUnitID="ca-app-pub-9133642311191277/8195639276"
                        //testDevices={[PublisherBanner.simulatorId]}
                        onAdFailedToLoad={error => console.log(error)}
                        />
                 </View>  
            );         
    }

};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginTop: 25,
        marginStart: 15,
        backgroundColor: 'white',
        paddingStart: 14,
        paddingEnd: 14
    },

    itemview: {
        flex: 1,
        height: 120,
        flexDirection: 'row',
        borderRadius: 8,
        borderColor: 'gray',
        elevation: 1,
        marginStart: 10,
        marginEnd: 10,
        marginTop: 8,
        marginBottom: 8
    },

    itemText: {
        height: '60%',
        fontSize: 18,
        color: 'black',
        fontWeight: "bold",
        paddingTop: 6,
        paddingStart: 3,
        paddingEnd: 5
    },

    text_con: {
        flex: 1,
        width: '55%',
        height: '100%',
        paddingStart: 3,
        justifyContent: 'center',
        alignContent: 'stretch'
    },

    text_view2: {
        flex: 1,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingStart: 3
    },

    adsCon: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 8
    }

});

export default Main;