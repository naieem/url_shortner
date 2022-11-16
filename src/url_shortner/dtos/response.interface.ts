export interface ICreateShorturlResponse {
    message: string;
    url: string;
    expiration: Date;
}
export interface IUrlRedirectionResponse {
    IsExpired: boolean;
    url: string;
    IsNotFoundStatus?: boolean;
}
export interface ResponseResults {
    result: any;
    isValid: boolean;
}