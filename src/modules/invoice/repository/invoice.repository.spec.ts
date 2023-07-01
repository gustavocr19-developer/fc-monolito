import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Product from "../domain/entity/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address.value-object";
import Invoice from "../domain/entity/invoice.entity";

const items = [
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
];

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const products = items.map(
      (item) =>
        new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
    );
    const address = new Address({
      street: "street",
      number: "777",
      city: "city",
      state: "state",
      zipCode: "111-11",
      complement: "complement",
    });

    const invoiceProps = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "00000",
      address,
      items: products,
    });

    const invoiceRepository = new InvoiceRepository();
    const invoice = await invoiceRepository.add(invoiceProps);

    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("00000");
    expect(invoice.address.street).toEqual("street");
    expect(invoice.address.number).toEqual("777");
    expect(invoice.items[0].id.id).toEqual("1");
    expect(invoice.items[0].name).toEqual("Product 1");
    expect(invoice.items[0].price).toEqual(100);
    expect(invoice.items[1].id.id).toEqual("2");
    expect(invoice.items[1].name).toEqual("Product 2");
    expect(invoice.items[1].price).toEqual(200);
    expect(invoice.total).toEqual(300);
  });

  it("should find a invoice", async () => {
    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "000000",
      addressStreet: "street",
      addressNumber: "777",
      addressComplement: "complement",
      addressCity: "city",
      addressState: "state",
      addressZipCode: "444-44",
      createdAt: new Date(),
      updatedAt: new Date(),
      items,
    });

    const invoiceRepository = new InvoiceRepository();

    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("000000");
    expect(invoice.address.street).toEqual("street");
    expect(invoice.address.number).toEqual("777");
    expect(invoice.items[0].id.id).toEqual("1");
    expect(invoice.items[0].name).toEqual("Product 1");
    expect(invoice.items[0].price).toEqual(100);
    expect(invoice.total).toEqual(300);
  });
});
