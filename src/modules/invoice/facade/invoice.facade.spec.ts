import { Sequelize } from "sequelize-typescript";
import { InvoiceFacadeFactory } from "../factory/facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import Address from "../domain/value-object/address.value-object";

describe("InvoiceFacade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "0000",
      street: "street",
      number: "123",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "000-00",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    };

    const invoiceGenerated = await invoiceFacade.generateInvoice(input);
    const savedInvoice = await InvoiceModel.findOne({
      where: { id: invoiceGenerated.id },
    });

    expect(invoiceGenerated.id).toBeDefined();
    expect(savedInvoice.id).toBeDefined();
    expect(invoiceGenerated.name).toBe(input.name);
    expect(invoiceGenerated.document).toEqual(input.document);
    expect(invoiceGenerated.items).toEqual(input.items);
    expect(invoiceGenerated.total).toEqual(300);
    expect(invoiceGenerated.street).toEqual(input.street);
    expect(invoiceGenerated.number).toEqual(input.number);
    expect(invoiceGenerated.complement).toEqual(input.complement);
    expect(invoiceGenerated.city).toEqual(input.city);
    expect(invoiceGenerated.state).toEqual(input.state);
    expect(invoiceGenerated.zipCode).toEqual(input.zipCode);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoiceCreated = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "00000",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
      addressStreet: "street",
      addressNumber: "number",
      addressComplement: "complement",
      addressCity: "city",
      addressState: "state",
      addressZipCode: "000-00",
    });

    const address = new Address({
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "000-00",
    });

    const result = await invoiceFacade.findInvoice({ id: "1" });

    expect(result.id).toEqual(invoiceCreated.id);
    expect(result.name).toEqual(invoiceCreated.name);
    expect(result.document).toEqual(invoiceCreated.document);
    expect(result.total).toEqual(300);
    expect(result.items.length).toEqual(2);
    expect(result.address).toEqual(address);
  });
});
