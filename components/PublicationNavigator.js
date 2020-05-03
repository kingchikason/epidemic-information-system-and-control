import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Publication from '../pages/Publication';
import ViewPub from '../pages/ViewPublication';

const StackNav = createStackNavigator();

export default function MyPub(){
    return(
        <StackNav.Navigator initialRouteName='Publication' headerMode='none' >
            <StackNav.Screen name='Publication' component={Publication} />
            <StackNav.Screen name='ViewPub' component={ViewPub} />
        </StackNav.Navigator>
    );
}