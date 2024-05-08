import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Aircraft, AircraftType, FirstFlight, Seat, SeatingPlan, SecondFlight } from './infrastructure';
import { Prisma, Staff, User } from '@prisma/client';
import { CreatePerfomanceDto } from './dto';

@Injectable()
export class PerformanceService {
    constructor(
        private prisma: PrismaService
    ) {}
    

    async fetchFlights() {
        try {
            const firstAircraft = new FirstFlight();
            const secondAircraft = new SecondFlight();
            const firstFlight = firstAircraft.toJSON();
            const secondFlight = secondAircraft.toJSON();
            return {
                message: "Available Flights",
                aircrafts: [
                    firstFlight,
                    secondFlight
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
                    createdBy: true,
                    bookings: true
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

    async getPerformances() {
        try {
            const performances = await this.prisma.performance.findMany({
                include: {
                    createdBy: true,
                    bookings: true
                }
            });
            return {
                message: "Performances fetched successfully",
                performances
            }
        } catch(error) {
            throw error;
        }
    }

    async getPerformanceByStaff(id: number) {
        try {
            const performances = await this.prisma.performance.findMany({
                where: {
                    staffId: id
                },
                include: {
                    createdBy: true,
                    bookings: true
                }
            });
            return {
                message: "Performances fetched successfully",
                performances
            }
        } catch(error) {
            throw error;
        }
    }

    async bookFlight(
        user: User,
        id: number,
        flightClass: FlightClass, 
        noOfSeats: number,
        userSeats?: Seat[] | null, // Rename seats to userSeats to avoid confusion
    ) {
        try {
            const performance = await this.prisma.performance.findUnique({
                where: {id},
                include: {
                    createdBy: true,
                    bookings: true
                }
            });
    
            if(!performance) throw new NotFoundException("Performance not found!");
    
            const aircraft = Aircraft.fromJson(JSON.stringify(performance.flight));
            let bookedSeats: Seat[];
            if(flightClass === FlightClass.First) {
                bookedSeats = aircraft.bookFirstClass(noOfSeats, userSeats);
            } else if (flightClass === FlightClass.Business) {
                bookedSeats = aircraft.bookBusinessClass(noOfSeats, userSeats);
            } else {
                aircraft.printFlightLayout();
                bookedSeats = aircraft.bookEconomyClass(noOfSeats, userSeats);
            }

            const [updatedPerf, booking] = await this.prisma.$transaction([
                this.prisma.performance.update({
                    where: {id: performance.id},
                    data: {
                    flight: aircraft
                    }
                }),
                this.prisma.booking.create({
                    data: {
                        performanceId: performance.id,
                        seats: SeatingPlan.seatsArrayToJson(bookedSeats),
                        noOfTickets: noOfSeats,
                        userId: user.id
                    },
                    include: {
                        performance: true,
                        user: true
                    }
                })
            ]);
            return booking;
        } catch(error) {
            throw error;
        }
    }
    
}

export enum FlightClass {
    Economy = "Economy",
    Business = "Business",
    First = "First"
}