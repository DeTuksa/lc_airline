import { Controller, Get } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('performance')
@Controller('performance')
export class PerformanceController {
    constructor(private service: PerformanceService) {}

    @Get('available-aircrafts')
    @ApiOperation({summary: 'Fetch available aircrafts'})
    async getAvailableAircrafts() {
        return this.service.fetchFlights();
    }
}
