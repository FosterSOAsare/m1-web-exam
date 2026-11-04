import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { BikeResponseDto, BikesPageResponseDto } from "./dto/bike-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { FindBikesQueryDto } from "./dto/find-bikes-query.dto";
import type { CreateBikeModel } from "./models/bike.model";

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

  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }
}
