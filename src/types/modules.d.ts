declare module "all-the-cities" {
  const cities: {
    cityId: number;
    name: string;
    altName: string;
    country: string;
    population: number;
    loc: { type: "Point"; coordinates: [number, number] };
  }[];
  export default cities;
}
