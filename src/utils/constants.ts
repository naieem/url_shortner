import { IUrlFilter, UrlFilterDTO } from "../url_shortner/dtos";
import { BLACKLIST } from './BLACKLIST'

interface IConditions {
    [key: string]: Object
}
interface IQueryMaker {
    query: {
        $or: IConditions[]
    }
}
export const TERMS = {
    'EXISTING_URL': 'Url already exists.',
    'EXPIRED_URL': 'Sorry Url got expired.',
    'NOT_FOUND_URL': 'Sorry Url not found.',
    'ROLE_SUPER_ADMIN': 'super-admin',
    'UNAUTHORIZED_TEXT': 'You are not authorized.',
    'FORBIDDEN_TEXT': 'You are forbidden to see this.',
    'INVALID_URL': 'Url not valid.',
    'DATE_EXPIRED': 'Provided expiry date should be future date.',
    'BLACKLISTED_MSG': 'Sorry,Provided url is in blacklisted category.',
    'REGEX_URL_VALIDATION_LOCAL_TEST': 'https?:\/{2}([a-zA-Z1-9])+:[0-9]{4}\/[a-zA-Z1-9_]+',
}
/**
 * Url validator function for using globally throughout the application
 * @param  {string} url
 * @returns string array
 */
export const urlValidator = (url: string): boolean => {
    try {
        const urlRegex = /https?:\/{2}([a-zA-Z1-9])+.[a-zA-Z]{2,4}$/gi;
        const matches = url.match(urlRegex);
        return matches && matches.length ? true : false;
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * Checking if a date is from past or not
 * @param  {Date} dateToValidate
 * @returns boolean
 */
export const expiryDateValidator = (dateToValidate: Date): boolean => {
    const today = new Date();
    const expiryDate = new Date(dateToValidate);
    return expiryDate < today ? true : false
}
/**
 * Organise query format for mongod query when all urls call
 * @param  options {@link UrlFilterDTO} object
 * @returns IQueryMaker {@link IQueryMaker} object
 */
export const queryMaker = (options: UrlFilterDTO): {} | IQueryMaker => {
    let filter: IUrlFilter = {}
    let query = {}
    let condition = [];

    options.shortCode ? filter.shortCode = options.shortCode : null;
    options.keyword ? filter.originalUrl = {
        $regex: options.keyword,
        $options: 'i'
    } : null;
    if (filter && Object.keys(filter).length) {
        for (const key in filter) {
            if (filter[key]) {
                condition.push({
                    [key]: filter[key]
                })
            }
        }
    }
    if (condition && condition.length) {
        query = {
            $or: condition
        }
    }
    return query
}
/**
 * Checking if an url is matched with a blacklisted data
 * @param  {string} url
 */
export const blackListChecker = (url: string) => {
    let isBlackListed: boolean = false;
    if (BLACKLIST && BLACKLIST.length) {
        for (const list of BLACKLIST) {
            const matches = url.match(new RegExp(list, 'i'));
            if (matches && matches.length) {
                isBlackListed = true;
                break;
            }
        }
    }
    return isBlackListed;
}