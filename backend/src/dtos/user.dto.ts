import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UserShareYoutubeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/, { message: 'Url is wrong format. Url must be youtuble url' })
  public url: string;
}
