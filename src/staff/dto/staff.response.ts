import { Staff } from "@prisma/client";

export class StaffResponseDto {
    status: true;
    staff: Staff;
    token: string;
}