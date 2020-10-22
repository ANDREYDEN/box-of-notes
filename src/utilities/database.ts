import firebase from 'firebase';
import IBox from '../models/Box';
import serviceAccount from '../service-account.json'

export default class Firestore {
    public app!: firebase.app.App;
    public db!: firebase.firestore.Firestore;

    private constructor() {
        this.app = firebase.initializeApp(serviceAccount);
        this.db = firebase.firestore(this.app);

        if (process.env.NODE_ENV === 'development') {
            this.db.settings({
                host: "localhost:8080",
                ssl: false,
            });
        }
    }

    private static _instance: Firestore | null = null;

    public static get instance(): Firestore {
        if (this._instance === null) {
            this._instance = new Firestore();
        }
        return this._instance;
    }

    public async createBox(box: IBox) {
        await Firestore.instance.db.collection('boxes').add(box)
    }
}