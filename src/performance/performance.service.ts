import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirstFlight } from './infrastructure';

@Injectable()
export class PerformanceService {
    constructor(
        private prisma: PrismaService
    ) {}
    

    async fetchFlights() {
        try {
            const firstAircraft = new FirstFlight();
            const flight = firstAircraft.toJSON();
            return {
                message: "Available Flights",
                aircrafts: [
                    flight
                ]
            }
        } catch(error) {
            throw error;
        }
    }
}
