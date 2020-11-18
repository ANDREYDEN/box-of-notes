import firebase from 'firebase'
import serviceAccount from './service-account.json'

firebase.initializeApp(serviceAccount)
console.log('App initialized');
// firebase.auth().useEmulator('http://localhost:4000') // TODO: figure out why this causes CORS problems

export default firebase