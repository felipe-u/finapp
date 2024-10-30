import { Address } from "./address.model";
import { ReferenceTypeEnum, RelationshipTypeEnum } from "./enums";
import { Identification } from "./identification.model";

export class Reference {
    constructor(
        public _id: string,
        public name: string,
        public identification: Identification,
        public referenceType: ReferenceTypeEnum,
        public phone: string,
        public relationship: RelationshipTypeEnum
    ) { }
}