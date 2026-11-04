import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number, limit: number) => {
    setIsLoading(true);
    axios
      .get<CustomersPageModel>("http://localhost:3000/customers", {
        params: { page, limit },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      setTotalCount((prev) => prev - 1);
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then((result) => {
        // Keep the same order as the backend: last name, then first name
        setCustomers((prev) =>
          [...prev, result.data].sort(
            (a, b) =>
              a.lastName.localeCompare(b.lastName) ||
              a.firstName.localeCompare(b.firstName),
          ),
        );
        setTotalCount((prev) => prev + 1);
      });

  return {
    customers,
    totalCount,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
