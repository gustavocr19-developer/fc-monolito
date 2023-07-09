import express, { Request, Response } from "express";

import InvoiceRepository from "../../modules/invoice/repository/invoice.repository"
import FindInvoiceUseCase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase.dto"

export const invoicesRoute = express.Router();

invoicesRoute.get("/:id", async (request: Request, response: Response) => {
  const invoiceRepository = new InvoiceRepository()
  const invoiceUseCase = new FindInvoiceUseCase(invoiceRepository)

  try {
    const input: FindInvoiceUseCaseInputDTO = {
      id: request.params.id,
    };

    const invoice: FindInvoiceUseCaseOutputDTO = await invoiceUseCase.execute(input);

    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    response.status(400).send(error);
  }
});