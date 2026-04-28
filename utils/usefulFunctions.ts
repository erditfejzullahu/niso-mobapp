import { Role, User } from "@/types/app-types";

export const getUserRole = (user: User) => {
    return user.role as Role;
}