/* `import firebase from "firebase";` is importing the Firebase module, which provides access to the
Firebase SDK and its various services, such as authentication, database, storage, and more. This
allows the code to interact with Firebase and use its services in the application. */
import firebase from "firebase";
/* `require("@firebase/firestore");` is importing the Firestore module from the Firebase SDK. This
allows the code to use Firestore to interact with the database. */
require("@firebase/firestore");

/* `firebaseConfig` is an object that contains the configuration settings for the Firebase project.
These settings include the API key, authentication domain, database URL, project ID, storage bucket,
messaging sender ID, and app ID. These settings are used to initialize the Firebase app and connect
it to the project's services, such as the Firestore database. */
const firebaseConfig = {
  apiKey: "AIzaSyAf2wPLdEyCVGVwOrIOjkRpUzH76V6gNY0",
  authDomain: "wireless-library-bc54f.firebaseapp.com",
  databaseURL: "https://wireless-library-bc54f-default-rtdb.firebaseio.com",
  projectId: "wireless-library-bc54f",
  storageBucket: "wireless-library-bc54f.appspot.com",
  messagingSenderId: "343090489635",
  appId: "1:343090489635:web:6441faeed4def6a18b4496"
};

/* `firebase.initializeApp(firebaseConfig);` initializes the Firebase app with the provided
configuration settings (`firebaseConfig`). This connects the app to the Firebase project and its
services, such as the Firestore database, and allows the app to interact with them. */
firebase.initializeApp(firebaseConfig);

/* `export default firebase.firestore();` is exporting the Firestore database instance from the
Firebase SDK as the default export of the module. This allows other modules to import and use the
Firestore instance in their code by simply importing this module. */
export default firebase.firestore();
