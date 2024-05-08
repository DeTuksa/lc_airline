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

    public printAircraftLayout(): void {
        this.seats.forEach((row) => {
            console.log(`${row.map(seat => seat.isAvailable ? `${seat.row}${seat.column}` : 'X').join(' ')}`);
        })
    }

    public book(numberOfSeats: number, userSeats: Seat[] | null) {
        let bookedSeats: Seat[] = [];

        const available = userSeats.every(seat => this.isSeatAvailable(seat));
        if (available) {
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

    // bookSeats(numberOfSeats: number, userSeats: Seat[] | null): Seat[] | null {
    //     let bookedSeats: Seat[] = [];

    //     if (userSeats && userSeats.length === numberOfSeats) {
    //         const allSeatsAvailable = userSeats.every(seat => this.isSeatAvailable(seat));
    //         if (allSeatsAvailable) {
    //             userSeats.forEach(seat => {
    //                 seat.isAvailable = false;
    //                 bookedSeats.push(seat);
    //             });
    //             return bookedSeats;
    //         }
    //     }

    //     for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
    //         const row = this.seats[rowIndex];
    //         for (let colIndex = 0; colIndex < row.length; colIndex++) {
    //             const seat = row[colIndex];
    //             if (seat.isAvailable && !this.isSingleScatteredSeat(rowIndex, colIndex)) {
    //                 seat.isAvailable = false;
    //                 bookedSeats.push(seat);
    //                 if (bookedSeats.length === numberOfSeats) {
    //                     return bookedSeats;
    //                 }
    //             }
    //         }
    //     }

    //     return null;
    // }

    public bookSeats(numberOfSeats: number, userSeats?: Seat[] | null): Seat[] | null {
        let bookedSeats: Seat[] = [];
    
        // Step 1: Check if user provided seats.
        if (userSeats) {
            // Step 2: If user provided seats, check if those seats are available.
            const allSeatsAvailable = userSeats.every(seat => this.isSeatAvailable(seat));
            if (allSeatsAvailable) {
                // Step 3: If seats are available, book seats.
                userSeats.forEach(seat => {
                    const row = this.seats[seat.row - 1];
                    if (row && row[seat.column.charCodeAt(0) - 65]) {
                        row[seat.column.charCodeAt(0) - 65].isAvailable = false;
                        bookedSeats.push(seat);
                    }
                });
                return bookedSeats;
            } else {
                // Step 4: If seats are not available return null
                return null;
            }
        } else {
            // Step 5: If user did not provide seats, check if the number of seats user provided are available
            let availableSeatsCount = 0;
            for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
                const row = this.seats[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const seat = row[colIndex];
                    if (seat.isAvailable && !this.isSingleScatteredSeat(rowIndex, colIndex)) {
                        availableSeatsCount++;
                        if (availableSeatsCount === numberOfSeats) {
                            // Step 6: If number of seats are available, check for rows that have those seats and book
                            for (let i = colIndex - numberOfSeats + 1; i <= colIndex; i++) {
                                const seatToBook = row[i];
                                if (seatToBook) {
                                    row[i].isAvailable = false;
                                    seatToBook.isAvailable = false;
                                    bookedSeats.push(seatToBook);
                                }
                            }
                            return bookedSeats;
                        }
                    } else {
                        availableSeatsCount = 0; // Reset count if consecutive seats are not available
                    }
                }
            }
            // If we reach here, it means there were not enough consecutive seats available
            return null;
        }
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

    public toJSON(): string {
        return JSON.stringify(this.seats);
    }

    static fromJson(json: string): SeatingPlan {
        const seatingPlanData: Seat[][] = JSON.parse(JSON.stringify(json));
        const rows = seatingPlanData.length;
        const columns = seatingPlanData[0].length;
        const seatingPlan = new SeatingPlan(rows, columns);
        seatingPlan.seats = seatingPlanData;
        return seatingPlan;
    }

    static seatsArrayToJson(seatsArray: Seat[]): string {
        return JSON.stringify(seatsArray);
    }
}

export class Aircraft {
    public firstClassSeatingPlan: SeatingPlan;
    public businessClassSeatingPlan: SeatingPlan;
    public economyClassSeatingPlan: SeatingPlan;
    constructor() {}

    public printFlightLayout(): void {
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

    static fromJson(jsonData: any): Aircraft {
        const flight = new Aircraft();
        flight.firstClassSeatingPlan = SeatingPlan.fromJson(JSON.parse(jsonData).firstClassSeatingPlan);
        flight.businessClassSeatingPlan = SeatingPlan.fromJson(JSON.parse(jsonData).businessClassSeatingPlan);
        flight.economyClassSeatingPlan = SeatingPlan.fromJson(JSON.parse(jsonData).economyClassSeatingPlan);        
        return flight;
    }

    public bookFirstClass(noOfSeats: number, seats?: Seat[] | null) {
        return this.firstClassSeatingPlan.bookSeats(noOfSeats, seats);
    }

    public bookBusinessClass(noOfSeats: number, seats?: Seat[] | null) {
        return this.businessClassSeatingPlan.bookSeats(noOfSeats, seats);
    }

    public bookEconomyClass(noOfSeats: number, seats?: Seat[] | null) {
        return this.economyClassSeatingPlan.bookSeats(noOfSeats, seats);
    }
}

export class FirstFlight extends Aircraft {
    // firstClassSeatingPlan: SeatingPlan;
    // businessClassSeatingPlan: SeatingPlan;
    // economyClassSeatingPlan: SeatingPlan;

    constructor() {
        super();
        this.firstClassSeatingPlan = new SeatingPlan(3, 4);
        this.businessClassSeatingPlan = new SeatingPlan(4, 6, 4);
        this.economyClassSeatingPlan = new SeatingPlan(13, 6, 8);
    }
}

export class SecondFlight extends Aircraft {
    // firstClassSeatingPlan: SeatingPlan;
    // businessClassSeatingPlan: SeatingPlan;
    // economyClassSeatingPlan: SeatingPlan;

    constructor() {
        super();
        this.firstClassSeatingPlan = new SeatingPlan(4, 4);
        this.businessClassSeatingPlan = new SeatingPlan(3, 6, 5);
        this.economyClassSeatingPlan = new SeatingPlan(21, 6, 8);
    }
}

export enum AircraftType {
    FirstFlight = 'firstFlight',
    SecondFlight = 'secondFlight'
}