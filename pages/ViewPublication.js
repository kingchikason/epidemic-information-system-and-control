import React,{ Component } from 'react';
import { View, Text, ScrollView, StyleSheet} from 'react-native';
import { Header, Icon, } from 'react-native-elements';

export default class ViewPublication extends Component {
    constructor(props){
        super(props);
        let ttl = this.props.route.params.title;
        let sc = this.props.route.params.source;
        let dtl = this.props.route.params.detail;
        let dt = this.props.route.params.date;
        let au = this.props.route.params.author;
        this.state = {
            title: ttl,
            source: sc,
            detail: dtl,
            date: dt,
            author: au
        }
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: this.state.title, style:{color: '#fff'} }} >
                </Header>
                <ScrollView style={{flex: 1, paddingStart: 10, paddingEnd: 10}}>
                    <Text style={styles.title}>
                        {this.state.title}
                    </Text>
                    <Text style={{fontSize: 16, color: 'gray'}}>
                        By {this.state.author}
                    </Text>
                    <View style={{height: 1, backgroundColor: 'gray', width: '100%', marginTop: 4}}/>
                    <Text style={styles.main}>
                        {this.state.detail}
                    </Text>

                    <Text style={{fontSize: 16, color: 'gray', marginTop: 25, fontStyle: 'italic'}}>
                        Published on {this.state.date}
                    </Text>
                    {
                        this.state.source.length > 2 && (
                            <Text style={{fontSize: 16, color: 'gray', marginBottom: 10, fontStyle: 'italic'}}>
                                Source: {this.state.source}
                            </Text>
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 21, 
        fontWeight: 'bold', 
        color: 'black', 
        justifyContent: 'center', 
        marginTop: 10
    },

    main: {
        marginTop: 4,
        color: 'black',
        fontSize: 18,
        fontWeight: 'normal',
    },

});