import { IsOptional, IsString } from 'class-validator';

export class SupportMessageDto {
  @IsString()
  subject!: string;

  @IsString()
  content!: string;
}

export class SupportResponseDto {
  @IsString()
  content!: string;
}

export class AssignMessageDto {
  @IsString()
  operatorId!: string;
}

export class DeleteMessageDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
