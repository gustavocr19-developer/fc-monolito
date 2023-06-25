import ValueObject from "../../../@shared/domain/value-object/value-object.interface"

type AddressProps = {
    street: string
    houseNumber: string
    complement: string
    city: string
    state: string
    zipCode: string
}


export default class Address implements ValueObject{
    private _street: string
    private _houseNumber: string
    private _complement: string
    private _city: string
    private _state: string
    private _zipCode: string

    constructor(props: AddressProps){
        this._street = props.street
        this._houseNumber = props.houseNumber
        this._complement = props.complement
        this._city = props.city
        this._state = props.state
        this._zipCode = props.zipCode
    }

    get street() :string{ 
        return this._street; 
    }

    get houseNumber(): string{
        return this._houseNumber
    }

    get complement(): string{
        return this._city
    }

    get city(): string{
        return this._complement
    }

    get state(): string{
        return this._state
    }

    get zipCode(): string{
        return this._zipCode
    }
}