import firebase from 'firebase'
import serviceAccount from './service-account.json'

firebase.initializeApp(serviceAccount)
console.log('App initialized');

export default firebase