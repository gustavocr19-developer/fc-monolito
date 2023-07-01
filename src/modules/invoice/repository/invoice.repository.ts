import Invoice from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceMapper from "./invoice.mapper";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoiceInput: Invoice): Promise<Invoice> {
    const inputMapped =
      InvoiceMapper.invoiceEntityToInvoiceCreateInput(invoiceInput);
    const invoice = await InvoiceModel.create(inputMapped);

    return InvoiceMapper.invoiceModelToInvoiceEntity(invoice);
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ where: { id } });
    if (!invoice) throw new Error("Invoice not found");

    return InvoiceMapper.invoiceModelToInvoiceEntity(invoice);
  }
}
