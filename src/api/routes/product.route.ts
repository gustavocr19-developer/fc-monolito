import express, { Request, Response } from "express";
import AddProductUseCase from "../../modules/product-adm/usecase/add-product/add-product.usecase"
import ProductRepository from "../../modules/product-adm/repository/product.repository"
export const productsRoute = express.Router();

productsRoute.post("/", async (request: Request, response: Response) => {
  const productRepository = new ProductRepository()
  const addProductUseCase = new AddProductUseCase(productRepository)

  try {
    const { id, name, description, stock, purchasePrice } = request.body;

    const productInput = {
      id,
      name,
      description,
      stock,
      purchasePrice,
    };

    await addProductUseCase.execute(productInput);

    response.status(201).send();
  } catch (error) {
    response.status(400).send(error);
  }
});