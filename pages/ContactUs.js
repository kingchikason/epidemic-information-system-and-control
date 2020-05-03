import React, {Component} from 'react';
import { View, Text, StyleSheet} from 'react-native';

class ContactUs extends Component {

    constructor(props){
        super(props);

    }

    render(){

        return(
            <View style={styles.body}>
                <Text>COntact Page</Text>
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

export default ContactUs;