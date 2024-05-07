export interface Seat {
    row: number;
    column: string;
    isAvailable: boolean;
}

export class SeatingPlan {
    public seats: Seat[][];

    constructor(rows: number, columns: number, startingRow: number = 1) {
        this.seats = new Array(rows).fill(null).map((_, rowIndex) => {
            return new Array(columns).fill(null).map((_, colIndex) => ({
                row: rowIndex + startingRow,
                column: String.fromCharCode(65 + colIndex),
                isAvailable: true
            }));
        });
    }

    printAircraftLayout(): void {
        this.seats.forEach((row) => {
            console.log(`${row.map(seat => seat.isAvailable ? `${seat.row}${seat.column}` : 'X').join(' ')}`);
        })
    }

    book(numberOfSeats: number, userSeats: Seat[] | null) {
        let bookedSeats: Seat[] = [];

        const available = userSeats.every(seat => this.isSeatAvailable(seat));
        if(available) {
            userSeats.forEach(seat => {
                seat.isAvailable = false;
                bookedSeats.push(seat);
            });
            return bookedSeats;
        } else {
            for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
                const row = this.seats[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const seat = row[colIndex];
                    if (seat.isAvailable && !this.isSingleScatteredSeat(rowIndex, colIndex)) {
                        let consecutiveAvailableSeats: Seat[] = [seat];
                        let consecutiveSeatsCount = 1;
                        for (let i = colIndex + 1; i < row.length; i++) {
                            const nextSeat = row[i];
                            if (nextSeat.isAvailable && !this.isSingleScatteredSeat(rowIndex, i)) {
                                consecutiveAvailableSeats.push(nextSeat);
                                consecutiveSeatsCount++;
                                if (consecutiveSeatsCount === numberOfSeats) {
                                    consecutiveAvailableSeats.forEach(seat => {
                                        seat.isAvailable = false;
                                        bookedSeats.push(seat);
                                    });
                                    return bookedSeats;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    bookSeats(numberOfSeats: number, userSeats: Seat[] | null): Seat[] | null {
        let bookedSeats: Seat[] = [];

        if (userSeats && userSeats.length === numberOfSeats) {
            const allSeatsAvailable = userSeats.every(seat => this.isSeatAvailable(seat));
            if (allSeatsAvailable) {
                userSeats.forEach(seat => {
                    seat.isAvailable = false;
                    bookedSeats.push(seat);
                });
                return bookedSeats;
            }
        }

        for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
            const row = this.seats[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const seat = row[colIndex];
                if (seat.isAvailable && !this.isSingleScatteredSeat(rowIndex, colIndex)) {
                    seat.isAvailable = false;
                    bookedSeats.push(seat);
                    if (bookedSeats.length === numberOfSeats) {
                        return bookedSeats;
                    }
                }
            }
        }

        return null;
    }

    private isSeatAvailable(seat: Seat): boolean {
        return this.seats[seat.row - 1][seat.column.charCodeAt(0) - 65].isAvailable;
    }

    private isSingleScatteredSeat(rowIndex: number, colIndex: number): boolean {
        if (colIndex > 0 && colIndex < this.seats[rowIndex].length - 1) {
            return !this.seats[rowIndex][colIndex - 1].isAvailable && !this.seats[rowIndex][colIndex + 1].isAvailable;
        }
        return false;
    }
}

class Aircraft {
    constructor(public name: string) {}
}

export class FirstFlight extends Aircraft {
    firstClassSeatingPlan: SeatingPlan;
    businessClassSeatingPlan: SeatingPlan;
    economyClassSeatingPlan: SeatingPlan;

    constructor() {
        super('Aircraft 1');
        this.firstClassSeatingPlan = new SeatingPlan(3, 4);
        this.businessClassSeatingPlan = new SeatingPlan(4, 6, 4);
        this.economyClassSeatingPlan = new SeatingPlan(13, 6, 8);
    }

    printFlightLayout(): void {
        console.log("Flight Layout:");
        console.log("First Class:");
        this.firstClassSeatingPlan.printAircraftLayout();
        console.log("Business Class:");
        this.businessClassSeatingPlan.printAircraftLayout();
        console.log("Economy Class:");
        this.economyClassSeatingPlan.printAircraftLayout();
    }

    toJSON() {
        return {
            firstClassSeatingPlan: this.firstClassSeatingPlan.seats,
            businessClassSeatingPlan: this.businessClassSeatingPlan.seats,
            economyClassSeatingPlan: this.economyClassSeatingPlan.seats
        }
    }
}

export class SecondFlight extends Aircraft {
    firstClassSeatingPlan: SeatingPlan;
    businessClassSeatingPlan: SeatingPlan;
    economyClassSeatingPlan: SeatingPlan;

    constructor() {
        super('Aircraft 2');
        this.firstClassSeatingPlan = new SeatingPlan(4, 4);
        this.businessClassSeatingPlan = new SeatingPlan(3, 6, 5);
        this.economyClassSeatingPlan = new SeatingPlan(21, 6, 8);
    }

    printFlightLayout(): void {
        console.log("Flight Layout:");
        console.log("First Class:");
        this.firstClassSeatingPlan.printAircraftLayout();
        console.log("Business Class:");
        this.businessClassSeatingPlan.printAircraftLayout();
        console.log("Economy Class:");
        this.economyClassSeatingPlan.printAircraftLayout();
    }

    toJSON() {
        return {
            firstClassSeatingPlan: this.firstClassSeatingPlan.seats,
            businessClassSeatingPlan: this.businessClassSeatingPlan.seats,
            economyClassSeatingPlan: this.economyClassSeatingPlan.seats
        }
    }
}

export enum AircraftType {
    FirstFlight = 'firstFlight',
    SecondFlight = 'secondFlight'
}