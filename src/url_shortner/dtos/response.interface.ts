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