import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsObject, IsOptional, IsString } from "class-validator";

export enum ContributionTypeDto {
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  TRANSLATION = "TRANSLATION",
  VALIDATION = "VALIDATION",
}

export class CreateContributionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ enum: ContributionTypeDto })
  @IsEnum(ContributionTypeDto)
  type!: ContributionTypeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  xpEarned?: number;
}
