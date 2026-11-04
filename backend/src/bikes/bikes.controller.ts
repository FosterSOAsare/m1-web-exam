import { Controller, Get, Inject, Query } from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { BikesPageResponseDto } from "./dto/bike-response.dto";
import { FindBikesQueryDto } from "./dto/find-bikes-query.dto";

@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  @Get()
  async findAll(
    @Query() query: FindBikesQueryDto,
  ): Promise<BikesPageResponseDto> {
    return BikesPageResponseDto.fromModel(
      await this.service.findAll({ page: query.page, limit: query.limit }),
    );
  }
}
