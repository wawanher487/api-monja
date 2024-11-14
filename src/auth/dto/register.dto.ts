import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly tanggal_lahir: string;

    @IsNotEmpty()
    @IsString()
    readonly alamat: string;

    @IsNotEmpty()
    @IsString()
    readonly no_hp: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter correct email"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}