import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  BikesPageModel,
  FindBikesModel,
} from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository)
    private readonly repository: BikesRepository,
  ) {}

  findAll(input: FindBikesModel): Promise<BikesPageModel> {
    return this.repository.findAll(input);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }
}
