import { Role, User } from "@/types/app-types";

export const getUserRole = (user: User | null) => {
    if(!user) return null;
    return user.role as Role;
}