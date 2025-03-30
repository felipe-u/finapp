export class GeoInfo {
    constructor(
        public _id: string,
        public address: string,
        public city: string,
        public department: string,
        public neighbourhood: string,
        public latitude: number,
        public longitude: number,
        public googleMapsUrl: string,
        public propertyImages: string[],
        public sector?: string,
        public additionalInfo?: string,
    ) { }
}