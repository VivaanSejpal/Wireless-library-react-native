/* 
  This is a class that creates a bottom tab navigator with two screens, Transaction and Search, using
  React Navigation in a React Native app. 
*/

/* These lines of code are importing necessary modules and components for creating a bottom tab
navigator using React Navigation in a React Native app. */
import React, { Component } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

/* These lines of code are importing the TransactionScreen and SearchScreen components from their
respective files located in the "../screens" directory. These components are then used as the
screens for the bottom tab navigator. */
import TransactionScreen from "../screens/Transaction";
import SearchScreen from "../screens/Search";

/* `const Tab = createBottomTabNavigator();` is creating a new instance of a bottom tab navigator using
the `createBottomTabNavigator` function from the `@react-navigation/bottom-tabs` module. This
instance is then used to define the screens and options for the bottom tab navigator in the
`Tab.Navigator` component. */
const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  render() {
    return (
      /* `<NavigationContainer>` is a component provided by the `@react-navigation/native` module that
      is used to wrap the entire navigation hierarchy of a React Native app. It initializes the
      navigation state and provides a context for all the navigators and screens in the app to
      access the navigation state. It is a required component for using any type of navigator from
      the `@react-navigation` library. */
      <NavigationContainer>
        <Tab.Navigator
          /* `screenOptions` is an object that contains options for customizing the appearance and
          behavior of the screens in the bottom tab navigator. In this case, it is defining a
          function that takes in the `route` object as a parameter and returns an object with a
          `tabBarIcon` property. */
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              /* This code block is checking the name of the current route and setting the `iconName`
              variable to a specific value based on the name of the route. If the current route's
              name is "Transaction", the `iconName` variable is set to "book". If the current
              route's name is "Search", the `iconName` variable is set to "search". This `iconName`
              variable is then used to determine which icon to display in the bottom tab navigator
              for the current route. */
              if (route.name === "Transaction") {
                iconName = "book";
              } else if (route.name === "Search") {
                iconName = "search";
              }

              // You can return any component that you like here!
              /* `return <Ionicons name={iconName} size={size} color={color} />;` is returning an
              instance of the `Ionicons` component with the `name`, `size`, and `color` props set
              based on the current route. This component is used as the icon for the current route
              in the bottom tab navigator. The `Ionicons` component is imported from the
              `react-native-vector-icons/Ionicons` module and is used to display icons in a React
              Native app. */
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          /* `tabBarOptions` is an object that contains various options for customizing the appearance
          and behavior of the bottom tab navigator. */
          tabBarOptions={{
            activeTintColor: "#FFFFFF",
            inactiveTintColor: "black",
            style: {
              height: 130,
              borderTopWidth: 0,
              backgroundColor: "#5653d4",
            },
            labelStyle: {
              fontSize: 20,
              fontFamily: "Rajdhani_600SemiBold",
            },
            labelPosition: "beside-icon",
            tabStyle: {
              marginTop: 25,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 30,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#5653d4",
            },
          }}
        >
          {/* `<Tab.Screen name="Transaction" component={TransactionScreen} />` is defining a screen for
          the bottom tab navigator with the name "Transaction" and the component
          `TransactionScreen`. This means that when the "Transaction" tab is selected in the bottom
          tab navigator, the `TransactionScreen` component will be displayed as the screen for that
          tab. */}
          <Tab.Screen name="Transaction" component={TransactionScreen} />
          {/* `<Tab.Screen name="Search" component={SearchScreen} />` is defining
          a screen for the bottom tab navigator with the name "Search" and the
          component `SearchScreen`. This means that when the "Search" tab is
          selected in the bottom tab navigator, the `SearchScreen` component
        will be displayed as the screen for that tab. */}
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
