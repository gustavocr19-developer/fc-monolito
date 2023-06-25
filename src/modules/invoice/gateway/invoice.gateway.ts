import Invoice from "../domain/entity/invoice.entity"

export default interface InvoiceGateway{
    generateInvoice(invoice: Invoice):Promise<void>
    findInvoice(id: string): Promise<Invoice>
}