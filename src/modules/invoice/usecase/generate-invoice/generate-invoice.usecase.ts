import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/entity/invoice.entity"
import Product from "../../domain/entity/product.entity"
import Address from "../../domain/value-object/address.value-object"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto"

export default class GenerateInvoiceUseCase{
    private _invoiceRepository: InvoiceGateway
    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository
    }

    async execute(input: GenerateInvoiceUseCaseInputDto):Promise<GenerateInvoiceUseCaseOutputDto>{
        const addressProps = {
            street: input.street,
            houseNumber: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
        }
        const address = new Address(addressProps)
        const items = input.items.map(item => new Product({
            id: new Id(item.id) || new Id(), 
            name: item.name, 
            price: item.price
        }))
        const props = {
            id: new Id(),
            name: input.name,
            document: input.document,
            address,
            items
        }
        
        const invoice = new Invoice(props)
        this._invoiceRepository.generateInvoice(invoice)

        const itemsOutput = invoice.items.map(item => ({ 
            id: item.id.id, 
            name: item.name, 
            document: item.name, 
            price: item.price
        }))

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.houseNumber,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: itemsOutput,
            total: invoice.total
        }
    }
}