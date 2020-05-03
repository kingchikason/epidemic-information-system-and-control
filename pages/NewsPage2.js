import React,{ Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Banner, NativeAdsManager} from 'react-native-ad-manager';
//import NativeAdView from '../NativeAdView'; //react-native-admob-native-ads": "^0.2.1
import Share from 'react-native-share';
import { AdMobBanner } from 'react-native-admob';


export default class NewsPage2 extends Component {
    constructor(props){
        super(props);
        let body = this.props.route.params.body;
        let ttl = this.props.route.params.title;
        let dt = this.props.route.params.date;
        let img_link = this.props.route.params.url_one;
        let vid_link = this.props.route.params.url_two;
        let reg = this.props.route.params.region;
        let nid = this.props.route.params.id;
        let x = body.length/2 + 150;
        let dtl1 = body.substring(0, body.lastIndexOf('.', x) + 1)
        let dtl2 = body.substring( dtl1.length, body.length - 1);
        //sets the state of the view
        this.state = {
                detail: body,
                body1: dtl1,
                body2: dtl2,
                title: ttl,
                date: dt,
                img_url: img_link,
                vid_url: vid_link,
                region: reg,
                id: nid,
                related_data:[]
            }
    }

    componentDidMount(){
        console.log('page mounted.');
        //loads the related news here using the region
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/related?region=' + this.state.region + '&news_id=' + this.state.id;
        fetch(url,{method: 'GET'}).then((response) => response.json())
                .then((responseJson) => {
                    let related = responseJson.data;
                    this.setState({related_data: related});
                })
                .catch(err => {
                    console.log(err);
                });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header placement="left"
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0,backgroundColor: '#42a5f5' }}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: this.state.title, style:{color: '#fff'} }} >
                </Header>
                <ScrollView style={{flex: 1, paddingStart: 10, paddingEnd: 10}}>
                    <Text style={styles.title_con} >
                        {this.state.title}
                    </Text>
                    <Text style={{fontSize: 14, color: 'gray', marginTop: 4}}>
                        Published on {this.state.date}
                    </Text>

                    <Image style={styles.img_con} source={{uri: this.state.img_url}} />
                    <Text style={styles.detail_con} >
                        {this.state.body1}
                    </Text>
                    
                    {
                        /* Ads placement here*/
                        <View style={{flex: 1, 
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                                paddingBottom: 5}}>
                            <Banner
                                adSize='mediumRectangle'
                                adUnitID="ca-app-pub-9133642311191277/8195639276"
                                onAdFailedToLoad={error => console.log(error)}
                                onAppEvent={event => console.log(event.name, event.info)}
                                />
                        </View>
                    }

                    <Text style={styles.detail_con2} >
                        {this.state.body2}
                    </Text>

                    <View style={{flex: 1,flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                        <TouchableOpacity onPress={()=> this._shareFB(this.state.title, this.state.detail, this.state.img_url)}>
                            <Image source={require('../assets/images/facebook.png')} style={{width: 42, height: 42, marginStart: 12}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._shareTwitter(this.state.title, this.state.detail, this.state.img_url)}>
                            <Image source={require('../assets/images/twitter.png')} style={{width: 42, height: 42, marginStart: 12}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._shareWXap(this.state.title, this.state.detail, this.state.img_url)}>
                            <Image source={require('../assets/images/whatsapp.png')} style={{width: 42, height: 42, marginStart: 12, marginEnd: 5}} />
                        </TouchableOpacity>
                    </View>

                    
                    {
                        /* Ads placement here*/
                        <View style={{flex: 1, 
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 15,
                            paddingBottom: 5}}>
                            <Banner
                            adSize='largeBanner'
                            adUnitID="ca-app-pub-9133642311191277/8195639276"
                            onAdFailedToLoad={error => console.log(error)}
                            onAppEvent={event => console.log(event.name, event.info)}
                            />
                        </View>
                    }
                    
                    <Text style={{flex: 1, fontSize: 16, color: 'gray', fontWeight: 'normal', marginTop: 15}} >
                        Related News
                    </Text> 

                    {
                        this.state.related_data.map((item, index) =>(
                        <TouchableOpacity onPress={() => this._openNewsView(item)} key={index} >
                            <View key={item.serial_no} style={styles.rview} >
                                <View style={styles.text_con} >
                                    <Text style={styles.itemText} ellipsizeMode='tail' numberOfLine={3} >
                                        {item.title}
                                    </Text>
                                    <View style={styles.text_view2} >
                                        <Text style={{color: 'gray', fontSize: 14}} >{item.source}</Text>
                                        <Text style={{color: 'gray', fontSize: 14, paddingEnd: 5}} >{item.published_date}</Text>
                                    </View>
                                </View>
                                <Image source={{uri: item.media_url_one}} style={{width: '40%', height: '99%', borderTopRightRadius:4, borderBottomRightRadius: 4, }} />
                            </View>
                        </TouchableOpacity>
                        ))
                    }

                    <View  style={{
                            flex: 1,
                            marginTop: 10,
                            marginBottom: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <AdMobBanner
                            adSize='largeBanner'
                            adUnitID="ca-app-pub-9133642311191277/8195639276"
                            onAdFailedToLoad={error => console.log(error)}
                            />
                    </View>
                </ScrollView>
            </View>
        );
    }

    _renderItems = ({item}) => {
        return(
            <TouchableOpacity onPress={() => this._openNewsView(item)}> 
                <View style={styles.itemview}>
                    <View style={styles.text_con} >
                        <Text style={styles.itemText} ellipsizeMode='tail' >
                            {item.title}
                        </Text>
                        <View style={styles.text_view2} >
                            <Text style={{color: 'gray', fontSize: 14}} >{item.source}</Text>
                            <Text style={{color: 'gray', fontSize: 14, paddingEnd: 5}} >{item.published_date}</Text>
                        </View>
                    </View>
                    <Image source={{uri: item.media_url_one}} style={{width: '40%', height: '100%'}} />
                </View>
            </TouchableOpacity>
        );
    }

    _openNewsView = (item) =>{
        this.props.navigation.navigate('NewsView',{title: item.title, body: item.detail, date: item.published_date, 
                    url_one: item.media_url_one, region: item.region, url_two: item.media_url_two, id: item.serial_no});
    }

    _shareFB = async (ttl, message, img_url) =>{

        let msg = message.substring(0, message.lastIndexOf(' ', 300));
        this._generateLink(ttl, msg, img_url, 'fb');
    }

    _shareTwitter = async (ttl, message, img_url) =>{

        let msg = message.substring(0, message.lastIndexOf(' ', 280));
        this._generateLink(ttl, msg, img_url, 'tw');
    }

    _shareWXap =  (ttl, message, img_url) =>{

        let msg = message.substring(0, message.lastIndexOf(' ', 300));
        this._generateLink(ttl, msg, img_url, 'wx');
    }

    _generateLink = async (ttl, dtl, url, type) => {
            let url1 = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBXcmftz-6RJH7Mfy-JBA4TSfHxcWOHy80';
            fetch(url1,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "dynamicLinkInfo": {
                        "domainUriPrefix": "https://weiscapp.page.link",
                        "link": "https://www.weiscapp.com/epidemic?news=2",
                        "androidInfo": {
                          "androidPackageName": "com.weiscproject"
                        },
                        "socialMetaTagInfo": {
                            "socialTitle": ttl,
                            "socialDescription": dtl,
                            "socialImageLink": url
                        }
                      },
                      "suffix": {
                        "option": "SHORT"
                      }
                })
                })
                .then((response) => response.json())
                .then((responseJson) =>{ 

                    if(type == 'fb'){
                        const options = {
                            title: 'Share WEISC information',
                            message:  dtl + '\n' + ' Read more on ',
                            url: responseJson.shortLink,
                            social: Share.Social.FACEBOOK
                        };
                
                        Share.shareSingle(options).then((response) => console.log(response))
                                .catch(err => console.log(err));
                    }
                    else if(type == 'tw'){
                        const options = {
                            title: 'Share WEISC information',
                            message:  dtl + '\n' + ' Read more ',
                            url: responseJson.shortLink,
                            social: Share.Social.TWITTER
                        };
                
                        Share.shareSingle(options).then((response) => console.log(response))
                        .catch(err => console.log(err));
                    }
                    else if(type == 'wx'){
                        const options = {
                            title: 'Share WEISC information',
                            message: dtl + '\n' + ' Read more ',
                            url: responseJson.shortLink,
                            whatsAppNumber: '+2348060158579',
                            social: Share.Social.WHATSAPP
                        };
                
                        Share.shareSingle(options).then((response) => console.log(response))
                        .catch(err => console.log(err));
                    }
                })
                .catch(err => {
                    Alert.alert('', 'sharing unavailable. try agin!')
                });
            
    }

}

const styles = StyleSheet.create({
    head_con: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        paddingTop: 15,
        marginStart: 14,
        marginEnd: 14
    },

    img_con: {
        width: '100%',
        height: 280,
        marginTop: 5,
        marginBottom: 5,
    },

    detail_con: {
        fontSize: 18, 
        fontStyle: 'normal',
        color: 'black', 
        marginTop: 5,
        fontWeight: 'normal'
    },

    detail_con2: {
        fontSize: 18, 
        fontStyle: 'normal',
        color: 'black', 
        marginTop: 5,
        fontWeight: 'normal'
    },

    title_con: {
        fontSize: 21, 
        color: 'black', 
        fontStyle: 'normal', 
        fontWeight: 'bold',
        marginTop: 5
    },

    itemview: {
        flex: 1,
        height: 80,
        flexDirection: 'row',
        borderRadius: 8,
        borderColor: 'gray',
        elevation: 2,
        marginStart: 10,
        marginEnd: 10,
        marginTop: 8,
        marginBottom: 8
    },

    itemText: {
        flex: 3,
        fontSize: 16,
        color: 'black',
        fontWeight: "bold",
        paddingTop: 2,
        paddingStart: 2,
    },

    text_con: {
        flex: 1,
        width: '58%',
        height: '100%',
        paddingStart: 3,
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'flex-start',
        alignContent: 'stretch'
    },

    text_view2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingStart: 5,
        marginTop: 6
    },

    rview: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        elevation: 1,
        borderRadius: 4,
        height: 100,
    }



});