import axios, { AxiosError } from "axios";
import API_PATHS, { API_PATHS_DB } from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

const API_URL = "https://akr36rafb5.execute-api.eu-west-1.amazonaws.com/dev";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<AvailableProduct[]>(`${API_URL}/products`);
      // const res = await axios.get<AvailableProduct[]>(
      //   `${API_PATHS_DB.product}/products`
      // );
      console.log("products:", res);
      return res.data;
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_URL}/products/${id}`
      );
      // const res = await axios.get<AvailableProduct>(
      //   `${API_PATHS_DB}/products/${id}`
      // );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation(
    (values: AvailableProduct) =>
      axios.put<AvailableProduct>(`${API_URL}/product`, values, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      })
    // axios.put<AvailableProduct>(`${API_PATHS_DB}/product`, values, {
    //   headers: {
    //     Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
    //   },
    // })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation(
    (id: string) =>
      axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      })
    // axios.delete(`${API_PATHS_DB}/products/${id}`, {
    //   headers: {
    //     Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
    //   },
    // })
  );
}
