import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import ReportCase from './pages/ReportCase';
import PubNav from './components/PublicationNavigator';
import ResearchPage from './pages/ResearchAndFindings';
import NavPage from './components/AppNavigator';
import Precaution from './pages/Precaution';
import NewsNav from './components/NewsNavigator';
import EFigures from './pages/EpidemicFigures';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Icon } from 'react-native-elements';


export default function App() {
  const Drawer = createDrawerNavigator();

  
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='NewsNav'
         drawerContent={props => <CustomDrawerCompoment {...props} /> } >

        <Drawer.Screen name='NewsNav' component={NewsNav} 
            options={{ drawerLabel: 'News Highlights', drawerIcon: ({tintColor}) =>(
              <Icon name="home" type="fontawesome"/>
            )}} />
          

        <Drawer.Screen name='Precaution' component={Precaution}
            options={{ drawerLabel: "Precautions & Control", drawerIcon: ({tintColor}) => (
              <Icon name="cog" type="font-awesome" />
            )}} />

        <Drawer.Screen name='EFigures' component={EFigures}
            options={{ drawerLabel: "Figures on Epidemics", drawerIcon: ({tintColor}) => (
              <Icon name="tags" type="font-awesome" />
            )}} />

        <Drawer.Screen name='Report' component={ReportCase} 
            options={{ drawerLabel: 'Report Symptom Case', drawerIcon: ({tintColor}) =>(
              <Icon name="magic" type="font-awesome"/>) }} />

        <Drawer.Screen name='Publication' component={PubNav}
            options={{drawerLabel: 'Publications On Epidemic', drawerIcon: ({tintColor}) =>(
              <Icon name="bank" type="font-awesome"/>) }} />

        <Drawer.Screen name='Research' component={ResearchPage} 
            options={{ drawerLabel: 'Research And Findings', drawerIcon: ({tintColor}) =>(
              <Icon name="camera" type="fontawesome"/>) }} />

        <Drawer.Screen name='Admins' component={NavPage}
            options={{ drawerLabel: 'Publish Material', drawerIcon:({tintColor}) =>(
              <Icon name="archive" type="fontawesome" /> ) }} />

      </Drawer.Navigator>
    </NavigationContainer>
  );

}

function CustomDrawerCompoment(props) {
     
  return(
    <DrawerContentScrollView {...props}>
      <ImageBackground source={require('./assets/images/n.png')} style={{flex:1, width: '100%', height: 150}} >
        <View style={styles.topView} >
          <Text style={styles.nem}>WEISC</Text>
          <Text style={{fontSize: 12, color: 'green'}}>Epidermic Information System And Control. Facts, Research, News, Findings and More</Text>
        </View>
      </ImageBackground>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  topView: {
    height: 152,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingStart: 15,
    paddingEnd: 15,
    paddingBottom: 4,
   // backgroundColor: '#42a5f5'
  },

  nem: {
    fontSize: 28,
    color: 'black',
    alignSelf: 'flex-start'
  },

  topMssg: {
    fontSize: 18,
    color: 'white',
    marginTop: 10
  }

});

