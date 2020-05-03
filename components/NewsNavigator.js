import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsView from '../pages/NewsPage';
import NewsView2 from '../pages/NewsPage2';
import MainView from '../pages/Main';

const StackNav = createStackNavigator();

export default function NewsStack(){
    return(
        <StackNav.Navigator initialRouteName='MainView' headerMode="none">
            <StackNav.Screen name='MainView' component={MainView} />
            <StackNav.Screen name='NewsView' component={NewsView} />
            <StackNav.Screen name="NewsView2" component={NewsView2} />
        </StackNav.Navigator>
    );
}