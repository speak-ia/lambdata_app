import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContributionsService } from "./contributions.service";
import { CreateContributionDto } from "./dto/create-contribution.dto";
import { FirebaseAuthGuard } from "../firebase/firebase-auth.guard";
import type { AuthenticatedRequest } from "../firebase/firebase-auth.guard";

@ApiTags("contributions")
@Controller("contributions")
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get("health")
  health() {
    return { status: "ok", module: "contributions" };
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() dto: CreateContributionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.contributionsService.create(dto, req.firebaseUid);
  }
}
