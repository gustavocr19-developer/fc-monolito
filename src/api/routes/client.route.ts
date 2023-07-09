import express, { Request, Response } from "express";
import AddClientUseCase from "../../modules/client-adm/usecase/add-client/add-client.usecase"
import ClientRepository from "../../modules/client-adm/repository/client.repository"
import { AddClientInputDto } from "../../modules/client-adm/usecase/add-client/add-client.usecase.dto"

export const clientsRoute = express.Router();

clientsRoute.post("/", async (request: Request, response: Response) => {
  const clientRepository = new ClientRepository();
  const addClientUseCase = new AddClientUseCase(clientRepository)

  try {
    const { id, name, email, address } = request.body;

    const clientInput: AddClientInputDto = {
      id,
      name,
      email,
      address,
    };

    await addClientUseCase.execute(clientInput);

    response.status(201).send();
  } catch (error) {
    response.status(400).send(error);
  }
});