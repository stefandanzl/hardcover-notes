

export interface MyPluginSettings {
	mySetting: string;
    authBearer: string;
    apiUrl: string;
}


export const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
    authBearer: '',
    apiUrl: 'https://hardcover-hasura-production-1136269bb9de.herokuapp.com/v1/graphql'
}



