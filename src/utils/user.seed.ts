import { TERMS } from "./constants";

export const UserSeedData = {
    displayName: "Naieem Mahmud Supto",
    email: "naieemsupto@gmail.com",
    roles: [TERMS.ROLE_SUPER_ADMIN]
}
export class UserSeedDTO {
    displayName: string;
    email: string;
    roles: string[];
}