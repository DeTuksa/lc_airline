import { User } from "@prisma/client";

export class UserResponse {
    message: string;
    status: boolean;
    user: User;
    token: string;
}