export const TERMS = {
    'EXISTING_URL': 'Url already exists.',
    'EXPIRED_URL': 'Sorry Url got expired.',
    'NOT_FOUND_URL': 'Sorry Url not found.',
    'ROLE_SUPER_ADMIN': 'super-admin',
    'UNAUTHORIZED_TEXT': 'You are not authorized.',
    'FORBIDDEN_TEXT': 'You are forbidden to see this.',
    'INVALID_URL': 'Url not valid'
}
export const urlValidator = (url: string): string[] => {
    try {
        const urlRegex = /https?:\/{2}([a-zA-Z1-9])+.[a-zA-Z]{2,4}$/gi;
        const matches = url.match(urlRegex);
        return matches;
    } catch (error) {
        throw new Error(error);
    }
}