import firebase from "firebase"
import "firebase/storage"
import { firebaseConfig } from '../../config'


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }
