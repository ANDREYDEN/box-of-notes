import firebase from '../firebase'

interface IAuth {
    user: firebase.User | null

    signIn(): Promise<firebase.User | null>
    signOut(): void
    onAuthStateChanged(callback: (user: firebase.User | null) => void): void
}

export default class Auth implements IAuth {
    private provider: firebase.auth.GoogleAuthProvider;
    public user: firebase.User | null = null;

    private constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider()
    }

    private static _instance: IAuth | null = null;

    public static get instance(): IAuth {
        if (this._instance === null) {
            this._instance = new Auth()
        }
        return this._instance;
    }

    public onAuthStateChanged(callback: ((user: firebase.User | null) => void)) {
        firebase.auth().onAuthStateChanged(callback)
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