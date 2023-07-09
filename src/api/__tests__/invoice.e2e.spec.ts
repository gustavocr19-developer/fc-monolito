import { app, sequelize } from "../index";
import request from "supertest";

import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Address from "../../modules/invoice/domain/value-object/address.value-object";
import Product from "../../modules/invoice/domain/entity/product.entity";
import Invoice from "../../modules/invoice/domain/entity/invoice.entity";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do the invoice", async () => {
    const address = new Address({
      street: "Street",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "122343404",
    });

    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      price: 100,
    });

    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      price: 200,
    });

    const invoice = new Invoice({
      id: new Id("123"),
      name: "Invoice 1",
      document: "Document 1",
      items: [product1, product2],
      address: address,
    });

    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.add(invoice);
    const response = await request(app).get(`/invoice/${123}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual("Invoice 1");
    expect(response.body.document).toEqual("Document 1");
  });
});
