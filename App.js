/* This is a React Native app component that loads custom fonts and switches between a login screen and
a bottom tab navigator. */

/* `import * as React from "react";` is importing the entire `React` module and assigning it to the
variable `React`. This allows the code to use the `React` library to create and manage React
components. The `*` syntax is used to import all of the exports from the `react` module, which
includes the `React` object and other utility functions and components. */
import * as React from "react";

import db from "./config";
import { createSwitchNavigator, createAppContainer } from "react-navigation";

import * as Font from "expo-font";
import { Rajdhani_600SemiBold } from "@expo-google-fonts/rajdhani";

import LoginScreen from "./screens/Login";
import BottomTabNavigator from "./components/BottomTabNavigator";

//class App is child class of React.Component which is its parent class
export default class App extends React.Component {
  /**
   * This is a constructor function that initializes the state of a component with a fontLoaded
   * property set to false.
   */
  constructor() {
    /* `super();` is calling the constructor of the parent class (`React.Component`) and passing any
    arguments that were passed to the child class constructor (`App`). This is necessary because the
    child class constructor overrides the parent class constructor, and calling `super();` ensures
    that the parent class constructor is still executed and any necessary setup is performed. In
    this case, it is necessary to call `super();` because the `constructor` method of the
    `React.Component` class sets up the initial state of the component. */
    super();

    /* `this.state = { fontLoaded: false }` is initializing the state of the `App` component with a
    property called `fontLoaded` set to `false`. The `state` object is a built-in property of React
    components that allows the component to store and manage its own data. In this case, `fontLoaded` is
    used to keep track of whether the custom font has finished loading or not. When the font is loaded,
    the `loadFonts()` method sets the `fontLoaded` state property to `true`, which triggers a re-render
    of the component and displays the app content. */
    this.state = {
      fontLoaded: false,
    };
  }

  /* `componentDidMount()` is a lifecycle method in React that is called after a component is mounted or
 rendered to the DOM. In this specific code, `componentDidMount()` is used to call the `loadFonts()`
 method, which loads custom fonts asynchronously using the `Font` module from Expo. Once the fonts
 are loaded, the `fontLoaded` state property is set to `true`, which triggers a re-render of the
 component and displays the app content. So, `componentDidMount()` is used to initialize the app by
 loading the necessary fonts before rendering the app content. */
  componentDidMount() {
    /* `this.loadFonts();` is calling the `loadFonts()` method defined in the `App` component. This
    method uses the `Font` module from Expo to load custom fonts asynchronously. Once the fonts are
    loaded, the `fontLoaded` state property is set to `true`, which triggers a re-render of the
    component and displays the app content. */
    this.loadFonts();
  }

  /**
   * This function loads a specific font asynchronously and sets the state of fontLoaded to true once
   * it's loaded.
   */
  async loadFonts() {
    await Font.loadAsync({
      Rajdhani_600SemiBold: Rajdhani_600SemiBold,
    });
    /* `this.setState({ fontLoaded: true });` is updating the state of the `App` component by setting the
    `fontLoaded` property to `true`. This is done using the `setState()` method, which is a built-in
    method of React components that allows them to update their own state. When the `fontLoaded`
    property is set to `true`, it triggers a re-render of the component and displays the app content.
    This is because the `render()` method of the component checks the value of `fontLoaded` and returns
    the app content if it is `true`. */
    this.setState({ fontLoaded: true });
  }

  /**
   * The function checks if a font is loaded and returns an app container if it is, otherwise it
   * returns null.
   * @returns If `fontLoaded` is `true`, the `AppContainer` component is returned. Otherwise, `null` is
   * returned.
   */
  render() {
    /* `const { fontLoaded } = this.state;` is using destructuring assignment to extract the
    `fontLoaded` property from the `state` object of the `App` component. It is equivalent to
    writing `const fontLoaded = this.state.fontLoaded;`. This allows the code to access the
    `fontLoaded` property directly without having to use `this.state.fontLoaded` every time. The
    extracted `fontLoaded` variable is then used to conditionally render the app content based on
    whether the custom font has finished loading or not. */
    const { fontLoaded } = this.state;
    //this.state.fontsLoaded

    if (fontLoaded) {
      /* 
        `return <AppContainer />;` is returning the `AppContainer` component, which is a container
        component that wraps the `AppSwitchNavigator` component and provides the necessary navigation
        functionality to the app. When the `fontLoaded` state property is `true`, the `render()`
        method of the `App` component returns the `AppContainer` component, which is then rendered in
        the app and displays the appropriate screen based on the current route. 
      */
      return <AppContainer />;
    }
    return null;
  }
}

/* `const AppSwitchNavigator = createSwitchNavigator(` is creating a switch navigator component using
the `createSwitchNavigator` function provided by the `react-navigation` library. The switch
navigator is a type of navigator that allows the user to switch between different screens or routes
in the app. It takes an object as its first argument, which defines the screens or routes that the
navigator should render, and an options object as its second argument, which specifies additional
configuration options for the navigator. In this case, the `AppSwitchNavigator` is defining two
screens or routes: `Login` and `BottomTab`, and setting the initial route to `Login`. */
const AppSwitchNavigator = createSwitchNavigator(
  {
    /* `Login: { screen: LoginScreen }` is defining a screen in the `AppSwitchNavigator` with the key
    `Login` and the value of `LoginScreen`. This means that when the user navigates to the `Login`
    screen, the `LoginScreen` component will be rendered. The `LoginScreen` is likely a custom
    component that displays a login form or page. */
    Login: {
      screen: LoginScreen,
    },
    /* `BottomTab: { screen: BottomTabNavigator }` is defining a screen in the `AppSwitchNavigator` with
   the key `BottomTab` and the value of `BottomTabNavigator`. This means that when the user
   navigates to the `BottomTab` screen, the `BottomTabNavigator` component will be rendered. The
   `BottomTabNavigator` is likely a custom component that displays a bottom tab bar with multiple
   screens that the user can navigate between. */
    BottomTab: {
      screen: BottomTabNavigator,
    },
  },
  /* `{ initialRouteName: "Login" }` is an option object passed to the `createSwitchNavigator`
  function. It specifies the initial route that the navigator should render when the app is first
  loaded. In this case, it sets the initial route to the `Login` screen. This means that when the
  app is first opened, the user will see the `Login` screen first. */
  {
    initialRouteName: "Login",
  }
);

/* `const AppContainer = createAppContainer(AppSwitchNavigator);` is creating a container component
that wraps the `AppSwitchNavigator` component and provides the necessary navigation functionality to
the app. The `createAppContainer` function is a higher-order component provided by the
`react-navigation` library that takes a navigator component as its argument and returns a new
component that can be rendered in the app. The `AppContainer` component is then rendered in the
`render` method of the `App` component, which is the root component of the app. */
const AppContainer = createAppContainer(AppSwitchNavigator);
