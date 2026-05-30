import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContributionDto } from "./dto/create-contribution.dto";
import { ContributionType } from "@prisma/client";

@Injectable()
export class ContributionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContributionDto, firebaseUid?: string) {
    return this.prisma.contribution.create({
      data: {
        userId: firebaseUid ?? dto.userId ?? "system",
        type: dto.type as ContributionType,
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
        xpEarned: dto.xpEarned ?? 10,
      },
    });
  }
}
