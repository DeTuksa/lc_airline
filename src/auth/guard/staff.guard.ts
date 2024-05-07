import { AuthGuard } from "@nestjs/passport";

export class StaffGuard extends AuthGuard('staff') {
    constructor() {
        super();
    }
}