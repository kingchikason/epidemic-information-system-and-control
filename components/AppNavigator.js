import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditorsPage from '../editors/Editors';
import AdminLoginPage from '../editors/AdminLogin';
import AddFact from '../editors/NewFacts';
import AddNews from '../editors/AddNews';
import Control from '../editors/Control';
import NewPublication from '../editors/AddPublication';
import AddArticle from '../editors/AddArticle';
import Register from '../editors/Register';
import AddFigure from '../editors/AddFigures';

const StackNav = createStackNavigator();

export default function MyStack(){
    return(
        <StackNav.Navigator initialRouteName="EditorsLogin">
            <StackNav.Screen name="EditorsLogin" component={AdminLoginPage} options={{ title: 'CONTENT EDITORS LOGIN' }} />
            <StackNav.Screen name="Content" component={EditorsPage} options={{ title: 'EDITORS DASHBOARD' }} />
            <StackNav.Screen name="NewNews" component={AddNews} options={{ title:'NEWS UPDATE ON EPIDERMIC'}} />
            <StackNav.Screen name="Control" component={Control} options={{ title: 'PRECAUTION & CONTROL'}} />
            <StackNav.Screen name="NewPublication" component={NewPublication} options={{ title: 'ADD PUBLICATIONS ON EPIDEMIC'}} />
            <StackNav.Screen name='RegisterUser' component={Register} options={{ title: 'REQUEST AN ACCOUNT'}} />
            <StackNav.Screen name="Figures" component={AddFigure} options={{title: 'EPIDEMIC FIGURES UPDATE'}} />
        </StackNav.Navigator>
    );
}
