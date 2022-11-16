interface Url {
    originalUrl: string;
    expiryDate: Date;
    shortCode: string;
    hitCounter: Number;
}
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
export interface AllUrlResponseResult extends ResponseResults {
    result: {
        urls: Url[],
        count: number
    };
}
export interface IUrlFilter {
    shortCode?: string;
    originalUrl?: any;
}