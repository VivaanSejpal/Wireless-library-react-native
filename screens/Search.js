/* The SearchScreen class is a React Native component that allows users to search for transactions in a
database and displays the results in a FlatList. */

/* These lines of code are importing necessary components and libraries for building a React Native
application. */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
/* Importing specific components from the "react-native-elements" library, which provides pre-built UI
components for React Native applications. The imported components are Avatar, ListItem, and Icon. */
import { Avatar, ListItem, Icon } from "react-native-elements";
import db from "../config";

export default class SearchScreen extends Component {
  /**
   * This is a constructor function that initializes the state of a component with an empty array for
   * allTransactions, null for lastVisibleTransaction, and an empty string for searchText.
   * @param props - props is an object that contains all the properties passed to the component from
   * its parent component. It can include data, functions, and other values that are needed by the
   * component. In this case, the props parameter is being passed to the constructor of a React
   * component.
   */
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      searchText: "",
    };
  }

  /* `componentDidMount` is a lifecycle method in React that is called after a component is mounted
  (i.e., inserted into the DOM). In this code, `componentDidMount` is being used to call the
  `getTransactions` function, which retrieves the first 10 transactions from the database and
  updates the state of the component with the retrieved data. The `async` keyword is used to
  indicate that the function contains asynchronous code (i.e., code that may take some time to
  complete, such as a database query), and the `await` keyword is used to wait for the asynchronous
  code to complete before continuing with the rest of the function. */
  componentDidMount = async () => {
    this.getTransactions();
  };

  /* `getTransactions` is a function that retrieves the first 10 transactions from the "transactions"
  collection in the database and updates the state of the component with the retrieved data. It uses
  the `limit()` method to limit the number of documents returned, and the `get()` method to retrieve
  the documents. Once the documents are retrieved, the `map()` method is used to iterate over each
  document and update the state with the data using `setState()`. The `allTransactions` array in the
  state is updated with the new data, and the `lastVisibleTransaction` variable is set to the last
  document retrieved. */
  getTransactions = () => {
    db.collection("transactions")
      .limit(10)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc,
          });
        });
      });
  };

  /* `handleSearch` is a function that is called when the user types in the search bar and presses the
  "Search" button. It takes in the text entered by the user as a parameter and converts it to
  uppercase. It then clears the `allTransactions` array in the component's state. If the text is
  empty, it calls the `getTransactions` function to retrieve the first 10 transactions from the
  database. If the first character of the entered text is "B", it queries the database for
  transactions where the book ID matches the entered text and updates the state with the retrieved
  data. If the first character is "S", it queries the database for transactions where the student ID
  matches the entered text and updates the state with the retrieved data. */
  handleSearch = async (text) => {
    var enteredText = text.toUpperCase().split("");
    text = text.toUpperCase();
    this.setState({
      allTransactions: [],
    });
    if (!text) {
      this.getTransactions();
    }

    if (enteredText[0] === "B") {
      db.collection("transactions")
        .where("book_id", "==", text)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()],
              lastVisibleTransaction: doc,
            });
          });
        });
    } else if (enteredText[0] === "S") {
      db.collection("transactions")
        .where("student_id", "==", text)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()],
              lastVisibleTransaction: doc,
            });
          });
        });
    }
  };

  /* `fetchMoreTransactions` is a function that is called when the user scrolls to the end of the
  FlatList component, indicating that more transactions need to be fetched from the database. It
  takes in the text entered by the user as a parameter and converts it to uppercase. It then checks
  the first character of the entered text to determine whether to query the database for
  transactions where the book ID or student ID matches the entered text. */
  fetchMoreTransactions = async (text) => {
    var enteredText = text.toUpperCase().split("");
    text = text.toUpperCase();

    const { lastVisibleTransaction, allTransactions } = this.state;
    if (enteredText[0] === "B") {
      /* The above code is querying a database collection named "transactions" and retrieving 10
      documents that have a "book_id" field equal to the value of the "text" variable. The query
      starts after the last visible transaction (specified by the "lastVisibleTransaction" variable)
      to retrieve the next set of 10 documents. The result of the query is stored in the "query"
      variable. */
      const query = await db
        .collection("transactions")
        .where("book_id", "==", text)
        .startAfter(lastVisibleTransaction)
        .limit(10)
        .get();
      /* The above code is using the `map()` function to iterate over an array of documents
      (`query.docs`) and for each document, it is updating the state of a React component.
      Specifically, it is adding the data of each document to an array (`allTransactions`) in the
      component's state and setting the last visible transaction to the current document
      (`lastVisibleTransaction: doc`). */
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    } else if (enteredText[0] === "S") {
      const query = await db
        .collection("transactions")
        .where("student_id", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    }
  };

  /* The above code is defining a function called `renderItem` that takes an object with properties
  `item` and `i` as its argument. The function then extracts the date from the `item` object,
  formats it, and assigns it to the `date` variable. It also determines the transaction type based
  on the `transaction_type` property of the `item` object and assigns it to the `transactionType`
  variable. */
  renderItem = ({ item, i }) => {
    var date = item.date.toDate().toString().split(" ").splice(0, 4).join(" ");

    var transactionType =
      item.transaction_type === "issue" ? "ISSUED" : "RETURNED";
    return (
      <View style={{ borderWidth: 1 }}>
        {/* The above code is a JSX code snippet written in JavaScript. It is
        creating a list item component with a unique key prop assigned to it.
        The bottomDivider prop is also being used to add a divider at the bottom
        of the list item. The variable "i" is likely being used as an index to
        ensure that each list item has a unique key. */}
        <ListItem key={i} bottomDivider>
          {/* The above code is written in JavaScript and it is rendering an icon
          using the Ant Design library. The icon being rendered is a book icon
          with a size of 40. */}
          <Icon type={"antdesign"} name={"book"} size={40} />
          <ListItem.Content>
            {/* The above code is rendering a title for a list item using the
            book name and book ID properties of an item object. It is using the
            ListItem.Title component and applying a style defined in the styles
            object. */}
            <ListItem.Title style={styles.title}>
              {`${item.book_name} ( ${item.book_id} )`}
            </ListItem.Title>
            {/* The above code is rendering a subtitle component in a list item
            with the text "This book [transactionType] by [item.student_name]".
            The values of `transactionType` and `item.student_name` are being
            dynamically inserted into the text using template literals. */}
            <ListItem.Subtitle style={styles.subtitle}>
              {`This book ${transactionType} by ${item.student_name}`}
            </ListItem.Subtitle>

            <View style={styles.lowerLeftContaiiner}>
              <View style={styles.transactionContainer}>
                {/* The  code is rendering a Text component with a style that sets the color of the
                text based on the value of the "transaction_type" property of the "item" object. If
                the value is "issue", the color will be set to "#78D304", otherwise it will be set
                to "#0364F4". The text content of the component is the capitalized value of the
    "transaction_type" property. */}
                <Text
                  style={[
                    styles.transactionText,
                    {
                      color:
                        item.transaction_type === "issue"
                          ? "#78D304"
                          : "#0364F4",
                    },
                  ]}
                >
                  {/* The above code is converting the first character of the string stored in the
                 `transaction_type` property of an object called `item` to uppercase and then
                 concatenating it with the rest of the string (excluding the first character) using
                 the `slice()` method. This is being done to ensure that the first letter of the
                 `transaction_type` is capitalized. */}
                  {item.transaction_type.charAt(0).toUpperCase() +
                    item.transaction_type.slice(1)}
                </Text>
                {/* The above code is rendering an Icon component based on the value of
                `item.transaction_type`. If the value is "issue", it will render a green checkmark
                icon, otherwise it will render a blue arrow icon. The `type` prop specifies the icon
                library being used (in this case, Ionicons), the `name` prop specifies the specific
                icon to render, and the `color` prop specifies the color of the icon. */}
                <Icon
                  type={"ionicon"}
                  name={
                    item.transaction_type === "issue"
                      ? "checkmark-circle-outline"
                      : "arrow-redo-circle-outline"
                  }
                  color={
                    item.transaction_type === "issue" ? "#78D304" : "#0364F4"
                  }
                />
              </View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  /**
   * This is a render function that returns a view with a search bar and a flatlist of transactions.
   * @returns A React Native view containing a search bar with a text input and a search button, and a
   * flat list of transactions. The transactions are fetched and rendered using the `allTransactions`
   * state variable, and more transactions are fetched when the user scrolls to the end of the list
   * using the `fetchMoreTransactions` function. The `renderItem` function is used to render each
   * transaction item in the list.
   */
  render() {
    const { searchText, allTransactions } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            {/* The above code is defining a TextInput component in a React Native application. The
            component has a style defined by the `styles.textinput` object, and it has an
            `onChangeText` event handler that updates the `searchText` state variable in the
            component's state whenever the user types in the TextInput. The TextInput also has a
    placeholder text and a placeholder text color defined. */}
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ searchText: text })}
              placeholder={"Type here"}
              placeholderTextColor={"#FFFFFF"}
            />

            {/* The above code is defining a TouchableOpacity component with a style of "scanbutton" and
            a Text component with a style of "scanbuttonText". When the TouchableOpacity is pressed,
            it will call the "handleSearch" function with the "searchText" parameter. This code is
            likely part of a larger React Native application and is used to create a search button
            that triggers a search function. */}
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.handleSearch(searchText)}
            >
              <Text style={styles.scanbuttonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          {/* The above code is rendering a FlatList component in a React Native application. The data
          for the list is provided by the `allTransactions` array. The `renderItem` function is used
          to render each item in the list. The `keyExtractor` function is used to extract a unique
          key for each item in the list. The `onEndReached` function is called when the user scrolls
          to the end of the list, and it triggers the `fetchMoreTransactions` function to fetch more
    data to be added to the list. The `onEndReachedThreshold` specifies how close to the end */}
          <FlatList
            data={allTransactions}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5653D4",
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold",
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontFamily: "Rajdhani_600SemiBold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rajdhani_600SemiBold",
  },
  lowerLeftContaiiner: {
    alignSelf: "flex-end",
    marginTop: -40,
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,

    fontFamily: "Rajdhani_600SemiBold",
  },
  date: {
    fontSize: 12,
    fontFamily: "Rajdhani_600SemiBold",
    paddingTop: 5,
  },
});
