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

// EJEMPLO DE USO
// const address = new Address('Colombia', 'Antioquia', 'Medellín');
// const location = new Location([-75.56359, 6.25184]); // Coordenadas de ejemplo
// const googleMapsUrl = 'https://www.google.com/maps/place/Medell%C3%ADn,+Antioquia';
// const images = [
//   'https://example.com/photo1.jpg',
//   'https://example.com/photo2.jpg',
// ];

// const geoInfo = new GeoInfo(address, location, googleMapsUrl, images);