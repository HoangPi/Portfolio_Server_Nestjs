import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsStrongPassword, isString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    fullname: string

    @IsNotEmpty()
    @IsAlphanumeric()
    username: string

    @IsStrongPassword({
        minLength: 6,
        minSymbols: 1,
        minNumbers: 0,
        minUppercase: 0,
        minLowercase: 0,
    })
    password: string
}
