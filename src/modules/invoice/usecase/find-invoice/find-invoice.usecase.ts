import InvoiceGateway from "../../gateway/invoice.gateway"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto"

export class FindInvoiceUseCase{
    private _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository
    }

    async execute(input: FindInvoiceUseCaseInputDTO):Promise<FindInvoiceUseCaseOutputDTO>{
        
        const invoice = await this._invoiceRepository.find(input.id);
        const itemsOutput = invoice.items.map(item => ({ 
            id: item.id.id, 
            name: item.name,
            price: item.price
        }))
        
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
              street: invoice.address.street,
              number: invoice.address.houseNumber,
              complement: invoice.address.complement,
              city: invoice.address.city,
              state: invoice.address.state,
              zipCode: invoice.address.zipCode,
            },
            items: itemsOutput,
            total: invoice.total,
            createdAt: invoice.createdAt,
        }
    }
}