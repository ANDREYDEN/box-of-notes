import firebase from '../firebase'

interface IAuth {
    user: firebase.User | null

    signIn(): Promise<firebase.User | null>
    signOut(): void
    onAuthStateChanged(callback: any): void
}

export default class Auth implements IAuth {
    private provider: firebase.auth.GoogleAuthProvider;
    public user: firebase.User | null = null;

    private subscribers: any[] = []

    private constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().onAuthStateChanged(user => {
            this.user = user
            this.subscribers.forEach(sub => sub(user))
        })
    }

    private static _instance: IAuth | null = null;

    public static get instance(): IAuth {
        if (this._instance === null) {
            this._instance = process.env.NODE_ENV === 'production' ? new Auth() : new DevAuth()
        }
        return this._instance;
    }

    public onAuthStateChanged(callback: any) {
        this.subscribers.push(callback)
    }

    public async signIn(): Promise<firebase.User | null> {
        try {
            const result = await firebase.auth().signInWithPopup(this.provider);
            return result.user;
        } catch (error) {
            console.log('Error Signing In: ' + error);
        }
        return null;
    }

    public async signOut(): Promise<void> {
        try {
            return await firebase.auth().signOut();
        } catch (error) {
            console.log('Error Signing Out: ' + error);
        }
    }
}

class DevAuth implements IAuth {
    public user: firebase.User | null = null;
    private fakeUser: any = {
        photoURL: 'https://www.newsshopper.co.uk/resources/images/7961105.jpg?display=1&htype=0&type=responsive-gallery'
    }

    constructor() {
        this.user = null;
    }

    signIn() {
        return this.user = this.fakeUser
    }

    signOut() {
        this.user = null
    }

    onAuthStateChanged(callback: any) {
        callback(this.user)
    }
}