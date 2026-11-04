import axios from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

export const useBikeDetailsProvider = (bikeId: string) => {
  const [bike, setBike] = useState<BikeModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const load = () => {
    setIsLoading(true);
    axios
      .get<BikeModel>(`http://localhost:3000/bikes/${bikeId}`)
      .then((result) => setBike(result.data))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { bike, load, isLoading };
};
