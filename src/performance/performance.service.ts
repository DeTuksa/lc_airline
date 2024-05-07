import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AircraftType, FirstFlight, SecondFlight } from './infrastructure';
import { Staff } from '@prisma/client';
import { CreatePerfomanceDto } from './dto';

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

    async createPerformance(
        staff: Staff,
        dto: CreatePerfomanceDto) {
        try {
            const flight = dto.aircraft === AircraftType.FirstFlight ? new FirstFlight() : new SecondFlight();

            const performance = await this.prisma.performance.create({
                data: {
                    from: dto.from,
                    to: dto.to,
                    departure: dto.departure,
                    arrival: dto.arrival,
                    duration: dto.duration,
                    price: dto.price,
                    flight,
                    staffId: staff.id,
                },
                include: {
                    createdBy: true
                }
            });

            return {
                message: "Performance created successfully",
                performance
            }

        } catch(error) {
            throw error;
        }
    }
}
