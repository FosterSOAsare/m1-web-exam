import { Inject, Injectable } from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type { BikesPageModel, FindBikesModel } from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository)
    private readonly repository: BikesRepository,
  ) {}

  findAll(input: FindBikesModel): Promise<BikesPageModel> {
    return this.repository.findAll(input);
  }
}
