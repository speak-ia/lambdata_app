import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContributionsService } from "./contributions.service";
import { CreateContributionDto } from "./dto/create-contribution.dto";

@ApiTags("contributions")
@Controller("contributions")
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get("health")
  health() {
    return { status: "ok", module: "contributions" };
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionsService.create(dto);
  }
}
