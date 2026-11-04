import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, QueryFailedError } from "typeorm";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  FindBikesModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeHasSalesError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(input: FindBikesModel): Promise<BikesPageModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    try {
      return this.toBikeModel(await repository.save(repository.create(input)));
    } catch (error) {
      this.translateError(error);
    }
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(BikeEntity);
        const entity = await repository.findOneBy({ id });
        if (!entity) throw new BikeNotFoundError();
        repository.merge(entity, input);
        return this.toBikeModel(await repository.save(entity));
      });
    } catch (error) {
      this.translateError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.dataSource.getRepository(BikeEntity).delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      error.message.includes("FOREIGN KEY constraint failed")
    ) {
      throw new BikeHasSalesError();
    }
    throw error;
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
