import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AircraftType } from "../infrastructure";

export class CreatePerfomanceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    from: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    to: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    departure: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    arrival: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    price: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    duration: string;

    @ApiProperty()
    @IsEnum(AircraftType)
    @IsNotEmpty()
    aircraft: AircraftType;
}