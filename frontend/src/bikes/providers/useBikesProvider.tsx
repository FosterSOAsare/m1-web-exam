import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
} from "../models/BikeModel";

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number, limit: number) => {
    setIsLoading(true);
    axios
      .get<BikesPageModel>("http://localhost:3000/bikes", {
        params: { page, limit },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Returns the request so the caller can react to errors (e.g. bike with sales)
  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      setBikes((prev) => prev.filter((bike) => bike.id !== id));
      setTotalCount((prev) => prev - 1);
    });

  // Returns the request so the caller can react to errors
  const createBike = (input: CreateBikeModel) =>
    axios
      .post<BikeModel>("http://localhost:3000/bikes", input)
      .then((result) => {
        // Keep the same order as the backend: brand, then model
        setBikes((prev) =>
          [...prev, result.data].sort(
            (a, b) =>
              a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model),
          ),
        );
        setTotalCount((prev) => prev + 1);
      });

  return { bikes, totalCount, load, isLoading, deleteBike, createBike };
};
