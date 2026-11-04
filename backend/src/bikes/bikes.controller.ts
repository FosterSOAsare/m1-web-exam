import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { BikeResponseDto, BikesPageResponseDto } from "./dto/bike-response.dto";
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

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }
}
