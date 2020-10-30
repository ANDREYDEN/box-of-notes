export const Urls = {
    Home: '/',
    NewBox: '/box',
    BoxPage: (params?: any): string => {
        return `/box/${params?.id ?? ':id'}`
    }
}