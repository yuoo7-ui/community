import { StyleSheet } from 'react-native';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';

import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import *as SplashScreen from 'expo-splash-screen';

//페이지
import TodoListScreen from './screens/TodoListScreen';
import TodoWriteScreen from './screens/TodoWriteScreen';
import MyPageScreen from './screens/MyPageScreen';
import HomeScreen from './screens/HomeScreen';
import ButlerScreen from './screens/ButlerScreen';
import GameScreen from './screens/GameScreen';
import BoardScreen from './screens/BoardScreen';



const DetailScreen = ({navigation,route})=>{
  const {todo}= route.params;
  return(
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text style ={{fontSize:30,fontWeight:"bold"}}>상세페이지 화면</Text>
        <Text>작성내용:{todo}</Text>
        <Button title='타이틀로 이동' onPress={()=> navigation.navigate("Home")}></Button>
      </View>
  );
}


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {

  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="활동일지"
        component={TodoStackScreen}
        options={{
          title: "활동일지",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <Entypo name="open-book" size={24} color="black" />
          ),
        }}
      />
       <Tab.Screen
        name="게시판"
        component={BoardScreen}
        options={{
          title: "게시판",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="comment" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "메인 홈",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <AntDesign name="home" size={24} color="black" />
          ),
        }}
      />
        <Tab.Screen
      name="Game"
      component={GameScreen}
      options={{
        title: "게임",
        headerTitleAlign: "center",
        tabBarIcon: ({ focused }) => (
          <FontAwesome6 name="gamepad" size={24} color="black" />
        ),
      }}
    />
      <Tab.Screen
        name="내정보"
        component={MyPageStackScreen}
        options={{
          title: "마이 페이지",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="circle-user" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>  
  );
}
  
function TodoStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="활동일지" 
        component={TodoListScreen} 
        options={{ title: "활동일지",headerShown: false, headerTitleAlign: "center" }} 
      />
      <Stack.Screen 
        name="활동일지쓰기" 
        component={TodoWriteScreen} 
        options={{ title: "활동일지쓰기",headerShown: false, headerTitleAlign: "center" }} 
      />
       <Stack.Screen 
        name="집사정보" 
        component={ButlerScreen} 
        options={{ title: "집사정보",headerShown: false, headerTitleAlign: "center" }} 
      />
    </Stack.Navigator>
  );
}

function MyPageStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="마이페이지" 
        component={MyPageScreen} 
        options={{ title: "마이페이지",headerShown: false, headerTitleAlign: "center" }} 
      />
      <Stack.Screen 
        name="집사정보" 
        component={ButlerScreen} 
        options={{ title: "집사정보",headerShown: false, headerTitleAlign: "center" }} 
      />
      
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
