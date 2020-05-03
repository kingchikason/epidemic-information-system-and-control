import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Button, Avatar } from 'react-native-elements';


class Editors extends Component {
    constructor(props){
        super(props);
         let ph = this.props.route.params.phone;
         let em = this.props.route.params.email;
         let nm = this.props.route.params.name;
         let rl = this.props.route.params.role;

        this.state = {
            email: em,
            name:  nm,
            phone:  ph,
            role: rl,
        }

    }

    render(){
        return(
            <View style={styles.body} >
            <View style={styles.topCon}>
                <Avatar size='large' rounded source={require('../assets/images/ic3.png')} />
                <Text style={{ fontWeight: '600',fontSize: 18, justifyContent: 'center', alignSelf: 'center', marginTop: 8}}>
                    Welcome To WEISC Content Page
                </Text>
                <Text style={{fontSize: 16, color: 'pink', marginTop: 2, }}> {this.state.name} </Text>
            </View>
            <View style={styles.centerCon}>
                    <Button title='Publish News Content' type='outline' buttonStyle={styles.bttons3} titleStyle={{color: 'skyblue'}} onPress={() => this.newsContent() } />
                    <Button title='Epidemic Current Figures' type='outline' buttonStyle={styles.bttons3} titleStyle={{color: 'skyblue'}} onPress={() => this.figuresUpdates()} />
                    <Button title="Precaution & Control" type='solid' buttonStyle={styles.bttons2} titleStyle={{color: 'skyblue'}} onPress={() => this.precautionControl() } />
                    <Button title='Publication on Epidermic' type='solid' buttonStyle={styles.bttons2} onPress={() => this.publicationPage() } />
                    <Button title='Research And Findings' type='solid' buttonStyle={styles.bttons2} onPress={() => this.researchPage() } />
            </View>
        </View>
        );
    }

    newsContent = () =>{
        //navigates to news content page
        this.props.navigation.navigate('NewNews');
    }

    publicationPage = () =>{
        //navigates to the article creation page
        this.props.navigation.navigate('NewPublication');
    }

    researchPage = () =>{

    }

    factPage = () =>{
        //navugates to the fact page
        this.props.navigation.navigate('NewFact');
    }

    precautionControl = () =>{
        this.props.navigation.navigate('Control');
    }

    figuresUpdates = () => {
        this.props.navigation.navigate('Figures', {name: this.state.name, phone: this.state.phone});
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },

    topCon: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },

    centerCon: {
        flex: 3,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        paddingStart: 14,
        paddingEnd: 14,
        marginTop: 15,
        paddingBottom: 15
    },

    bttons: {
        height: 45,
        backgroundColor: 'skyblue',
        borderRadius: 5,
        marginBottom: 10
    },

    bttons2: {
        height: 45,
        backgroundColor: 'red',
        borderRadius: 5,
        marginBottom: 10
    },

    bttons3: {
        height: 45,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: 'gray'
    },

});

export default Editors;