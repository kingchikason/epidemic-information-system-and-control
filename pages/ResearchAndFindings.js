import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { Header, Icon} from 'react-native-elements';

class ResearchAndFindings extends Component {

    constructor(props){
        super(props);

    }

    render(){

        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    containerStyle={{height: Platform.select({ android: 56, ios: 44, default: 44}), paddingTop: 0, backgroundColor: '#42a5f5'}}
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'Research and Findings on Epidemics', style:{color: '#fff'} }} >
                </Header>
                <ScrollView>
                    <Text style={{ fontSize: 16, marginTop: 55, justifyContent:'center', alignSelf: 'center', padding: 5,
                        borderWidth: 1, borderColor: 'gray', borderRadius: 5}}>
                        no material yet. check later! 
                    </Text>
                </ScrollView>

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
    }
});

export default ResearchAndFindings;