import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address.value-object";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceMapper {
  static invoiceEntityToInvoiceCreateInput(invoice: Invoice) {
    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      addressStreet: invoice.address.street,
      addressNumber: invoice.address.number,
      addressComplement: invoice.address.complement,
      addressCity: invoice.address.city,
      addressState: invoice.address.state,
      addressZipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }
  }
  
  static invoiceModelToInvoiceEntity(invoice: InvoiceModel): Invoice {
    const items = invoice.items.map(
      (item) =>
        new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
    );
    const address = new Address({
      street: invoice.addressStreet,
      number: invoice.addressNumber,
      complement: invoice.addressComplement,
      city: invoice.addressCity,
      state: invoice.addressState,
      zipCode: invoice.addressZipCode,
    });

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      address,
      items,
    });
  }
}
