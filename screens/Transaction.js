/* The TransactionScreen class is a React Native component that allows users to scan book and student
IDs and initiate book issue or return transactions based on the availability of the book and the
eligibility of the student. */

/* These are import statements in JavaScript that import various modules and components required for
the TransactionScreen class to function properly. */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from "firebase";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  /**
   * This is a constructor function that initializes the state of a component with various properties.
   * @param props - props is an object that contains properties passed down from a parent component to
   * the current component. These properties can be accessed using `this.props`. In the constructor,
   * `props` is passed as a parameter to the `super` method, which is required when defining a
   * constructor in a React component.
   */
  constructor(props) {
    super(props);
    this.state = {
      bookId: "",
      studentId: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      bookName: "",
      studentName: "",
    };
  }

  /* The above code is defining an asynchronous function `getCameraPermissions` that takes in a
`domState` parameter. The function requests camera permissions from the user using the
`Permissions.askAsync` method from the Expo SDK. The status of the permission request is stored in
the `status` variable. */
  getCameraPermissions = async (domState) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false,
    });
  };

  /* The above code is defining an asynchronous function `handleBarCodeScanned` that takes an object
  with `type` and `data` properties as its argument. It then checks the value of the `domState`
  property in the component's state. If `domState` is equal to "bookId", it sets the `bookId`
  property in the component's state to the value of `data`, sets `domState` to "normal", and sets
  `scanned` to `true`. If `domState` is equal to "studentId", it sets the `studentId` */
  handleBarCodeScanned = async ({ type, data }) => {
    const { domState } = this.state;

    if (domState === "bookId") {
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true,
      });
    } else if (domState === "studentId") {
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true,
      });
    }
  };

  /* The above code is a function called `handleTransaction` that is being used to handle book
transactions in a library management system. It takes the book ID and student ID as input, and then
uses various helper functions to check the availability of the book, the eligibility of the student
to issue or return the book, and then initiates the book issue or return process accordingly. The
function also displays appropriate messages to the user using `Alert.alert` or `ToastAndroid.show`
depending on the platform. */
  handleTransaction = async () => {
    var { bookId, studentId } = this.state;
    /* The above code is using the `await` keyword to
    asynchronously call the `getBookDetails` function with a
    `bookId` parameter. The `await` keyword is used to wait
    for the function to complete before moving on to the next
    line of code. */
    await this.getBookDetails(bookId);

    /* The above code is using the `await` keyword to call the `getStudentDetails` function with a
    `studentId` parameter. The `await` keyword is used to wait for the function to complete and
    return a value before continuing with the rest of the code. This code is likely part of an
    asynchronous function or a function that returns a promise. */
    await this.getStudentDetails(studentId);

    /* The above code is declaring a variable called `transactionType` and assigning it the result of
    an asynchronous function call `this.checkBookAvailability(bookId)`. The `await` keyword is used
    to wait for the function to complete and return a value before assigning it to the
    `transactionType` variable. The purpose of the function is to check the availability of a book
    with the given `bookId`. */
    var transactionType = await this.checkBookAvailability(bookId);

    /* The above code is checking if the variable `transactionType` is falsy. If it is falsy, it sets
    the `bookId` and `studentId` state variables to an empty string and displays an alert message
    saying "The book doesn't exist in the library database!". There is also a commented out line of
    code that shows a toast message for Android users. */
    if (!transactionType) {
      this.setState({ bookId: "", studentId: "" });
      // For Android users only
      // ToastAndroid.show("The book doesn't exist in the library database!", ToastAndroid.SHORT);
      Alert.alert("The book doesn't exist in the library database!");
    }
    
    else if (transactionType === "issue") {
    
      /* The above code is checking the eligibility of a student for issuing a book by calling the
      function `checkStudentEligibilityForBookIssue` with the `studentId` as a parameter. The
      function is being awaited, indicating that it is an asynchronous function. The result of the
      function will be stored in the variable `isEligibleforIssue`. */
      var isEligibleforIssue = await this.checkStudentEligibilityForBookIssue(
        studentId
      );

    
      /* The above code is checking if a student is eligible to issue a book. If the student is
      eligible, it extracts the book name and student name from the state object and initiates the
      book issue process by calling the `initiateBookIssue` function with the book ID, student ID,
      book name, and student name as arguments. */
      if (isEligibleforIssue) {
        var { bookName, studentName } = this.state;
        this.initiateBookIssue(bookId, studentId, bookName, studentName);
      }

      // For Android users only
      // ToastAndroid.show("Book issued to the student!", ToastAndroid.SHORT);
      Alert.alert("Book issued to the student!");

    } else {
      
      /* The above code is using the `await` keyword to call the `checkStudentEligibilityForBookReturn`
      function with `bookId` and `studentId` as parameters and assigning the returned value to the
      `isEligibleforReturn` variable. The function is likely checking if the student is eligible to
      return the book with the given `bookId`. The use of `await` suggests that the function may be
      asynchronous and will wait for the function to complete before continuing execution. */
      var isEligibleforReturn = await this.checkStudentEligibilityForBookReturn(
        bookId,
        studentId
      );

      /* The above code is checking if a book is eligible for return and if it is, it is extracting the
      book name and student name from the state object and passing them along with the book ID and
      student ID to a function called `initiateBookReturn()`. */
      if (isEligibleforReturn) {
        var { bookName, studentName } = this.state;
        this.initiateBookReturn(bookId, studentId, bookName, studentName);
      }
      // For Android users only
      // ToastAndroid.show("Book returned to the library!", ToastAndroid.SHORT);
      Alert.alert("Book returned to the library!");
    }
  };

  /* The above code is a JavaScript function that takes a bookId as a parameter and retrieves the book
details from a Firestore database. It first trims the bookId to remove any leading or trailing
spaces. Then it queries the "books" collection in the database to find the document where the
"book_id" field matches the given bookId. Once it finds the document, it retrieves the "book_name"
field from the "book_details" subcollection and sets it as the state of the component. */
  getBookDetails = (bookId) => {
    bookId = bookId.trim();
    db.collection("books")
      .where("book_id", "==", bookId)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            bookName: doc.data().book_details.book_name,
          });
        });
      });
  };

  /* The above code is a JavaScript function that takes a student ID as input and retrieves the
 corresponding student details from a database collection called "students". It first trims the
 input student ID to remove any leading or trailing white spaces. Then, it queries the "students"
 collection to find the document(s) where the "student_id" field matches the input student ID. Once
 it receives the query snapshot, it maps through the documents and sets the "studentName" state
 variable to the value of the "student_name" field in the retrieved document. */
  getStudentDetails = (studentId) => {
    studentId = studentId.trim();
    db.collection("students")
      .where("student_id", "==", studentId)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            studentName: doc.data().student_details.student_name,
          });
        });
      });
  };

  /* The above code is defining an asynchronous function `checkBookAvailability` that takes a `bookId`
parameter. Inside the function, it queries the Firestore database to check if a book with the given
`bookId` exists in the `books` collection. If the book exists, it checks if the book is available or
not. If the book is available, it sets the `transactionType` variable to "issue", otherwise it sets
it to "return". If the book does not exist in the collection, it sets the `transactionType` variable
to false. Finally, the function returns the ` */
  checkBookAvailability = async (bookId) => {
    const bookRef = await db
      .collection("books")
      .where("book_id", "==", bookId)
      .get();

    var transactionType = "";
    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map((doc) => {
        //if the book is available then transaction type will be issue
        // otherwise it will be return
        transactionType = doc.data().is_book_available ? "issue" : "return";
      });
    }

    return transactionType;
  };

  /* The above code is a function in JavaScript that checks the eligibility of a student to issue a book
 from a library. It takes a student ID as input and queries the "students" collection in a database
 to check if the student exists and if they have already issued 2 books. If the student ID doesn't
 exist in the database, it displays an alert message and sets the bookId and studentId state to
 empty strings. If the student has already issued 2 books, it displays an alert message and sets the
 bookId and studentId state to empty strings. If the student is eligible to issue */
  checkStudentEligibilityForBookIssue = async (studentId) => {
    const studentRef = await db
      .collection("students")
      .where("student_id", "==", studentId)
      .get();

    var isStudentEligible = "";
    if (studentRef.docs.length == 0) {
      this.setState({
        bookId: "",
        studentId: "",
      });
      isStudentEligible = false;
      Alert.alert("The student id doesn't exist in the database!");
    } else {
     /* The above code is checking if a student is eligible to issue a book or not based on the number
     of books they have already issued. If the number of books issued is less than 3, then the
     student is eligible to issue a book and the variable `isStudentEligible` is set to true. If the
     number of books issued is equal to or greater than 3, then the student is not eligible to issue
     a book and an alert message is displayed. The `bookId` and `studentId` states are also reset to
     empty strings. */
      studentRef.docs.map((doc) => {
        if (doc.data().number_of_books_issued < 3) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          Alert.alert("The student has already issued 3 books, which is the maximum number of books that a student is allowed to issue at once.!");
          this.setState({
            bookId: "",
            studentId: "",
          });
        }
      });
    }

    return isStudentEligible;
  };

  /* The above code is a JavaScript function that checks if a student is eligible to return a book. It
  takes two parameters, `bookId` and `studentId`. It queries the `transactions` collection in a
  database to find the last transaction for the given `bookId`. If the `studentId` matches the
  `student_id` in the last transaction, the function returns `true`, indicating that the student is
  eligible to return the book. If the `studentId` does not match, the function returns `false` and
  displays an alert message indicating that the book was not issued by the given */
  checkStudentEligibilityForBookReturn = async (bookId, studentId) => {
    /* The above code is querying a Firestore database collection called "transactions" and retrieving
    a single document that has a field called "book_id" with a value equal to the variable "bookId".
    The query is limited to only return one document. The result of the query is stored in the
    constant variable "transactionRef". The code is written in JavaScript and uses the "await"
    keyword to wait for the query to complete before continuing execution. */
    const transactionRef = await db
      .collection("transactions")
      .where("book_id", "==", bookId)
      .limit(1)
      .get();

    var isStudentEligible = "";
    
    transactionRef.docs.map((doc) => {
      var lastBookTransaction = doc.data();

      if (lastBookTransaction.student_id === studentId) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        Alert.alert("The book wasn't issued by this student!");
        this.setState({
          bookId: "",
          studentId: "",
        });
      }
    });
    return isStudentEligible;
  };

  /* The above code is defining a function called `initiateBookIssue` that takes in four parameters:
  `bookId`, `studentId`, `bookName`, and `studentName`. */
  initiateBookIssue = async (bookId, studentId, bookName, studentName) => {
    //add a transaction
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "issue",
    });
    //change book status
    db.collection("books").doc(bookId).update({
      is_book_available: false,
    });
    //change number  of issued books for student
    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(1),
      });

    // Updating local state
    this.setState({
      bookId: "",
      studentId: "",
    });
  };

  /* The above code is a function called `initiateBookReturn` that takes in four parameters: `bookId`,
  `studentId`, `bookName`, and `studentName`. */
  initiateBookReturn = async (bookId, studentId, bookName, studentName) => {
    //add a transaction
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: "return",
    });
    //change book status
    db.collection("books").doc(bookId).update({
      is_book_available: true,
    });
    //change number  of issued books for student
    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(-1),
      });

    // Updating local state
    this.setState({
      bookId: "",
      studentId: "",
    });
  };

  render() {
    const { bookId, studentId, domState, scanned } = this.state;
    //this.state.bookId 
   /* The above code is checking if the variable `domState` is not equal to the string "normal". If it
   is not equal to "normal", then the code inside the if statement will be executed. */
    if (domState !== "normal") {
      return (
        /* The above code is written in JavaScript and it is using the BarCodeScanner component to scan
       barcodes. It is setting up an event listener for when a barcode is scanned and calling the
       `handleBarCodeScanned` function when a barcode is scanned. The `scanned` variable is used to
       determine whether or not a barcode has already been scanned. If it has been scanned, the
       event listener is set to `undefined` to prevent multiple scans. The
       `StyleSheet.absoluteFillObject` is used to style the BarCodeScanner component to fill the
       entire screen. */
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              {/* The above code is defining a TextInput component in a React Native application. It has
              a style defined by the `styles.textinput` object, a placeholder text of "Book Id" with
              white placeholder text color, and a value of `bookId` which is a state variable.
              Whenever the user types in the TextInput, the `onChangeText` function is called and
              updates the `bookId` state variable with the new text. */}
              <TextInput
                style={styles.textinput}
                placeholder={"Book Id"}
                placeholderTextColor={"#FFFFFF"}
                value={bookId}
                onChangeText={(text) => this.setState({ bookId: text })}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("bookId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
           { /* The above code is rendering a view with a text input and a button. The text input is
            used to enter a student ID and the button is used to scan the ID using the device's
            camera. The `getCameraPermissions` function is called when the button is pressed and it
            requests permission to access the camera. The scanned ID is then stored in the
            component's state using the `setState` method. */}
            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={"Student Id"}
                placeholderTextColor={"#FFFFFF"}
                value={studentId}
                onChangeText={(text) => this.setState({ studentId: text })}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("studentId")}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            {/* The above code is rendering a TouchableOpacity component with a button style and a Text
            component with the text "Submit". When the button is pressed, it will call the
            handleTransaction function. */}
            <TouchableOpacity
              style={[styles.button, { marginTop: 25 }]}
              onPress={this.handleTransaction}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  lowerContainer: {
    flex: 0.5,
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
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold",
  },
});
