export class Location {
    constructor(
        public type = 'Point',
        public coordinates: [number, number]
    ) { }
}