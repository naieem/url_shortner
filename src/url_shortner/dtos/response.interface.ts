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
export interface IResponseResults {
    result: any;
    isValid: boolean;
}
export interface IAllUrlResponseResult extends IResponseResults {
    result: IUrlResponse;
}
export interface IUrlFilter {
    shortCode?: string;
    originalUrl?: any;
}
export interface IUrlResponse {
    urls: Url[];
    resultCount: number;
    totalCount: number;
}