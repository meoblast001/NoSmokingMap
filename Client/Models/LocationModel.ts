import { ElementType } from "./ElementType";

export default interface LocationModel {
  id: number;
  name: string;
  type: ElementType;
  lat?: number;
  lon?: number;
  smoking: string | null;
}

export function isLocationModel(x: any): x is LocationModel {
  return typeof(x.id) == 'number'
    && typeof(x.name) == 'string'
    && (x.type == 'node' || x.type == 'way' || x.type == 'relation')
    && (typeof(x.lat) == 'number' || x.lat === null || x.lat === undefined)
    && (typeof(x.lon) == 'number' || x.lon === null || x.lon === undefined)
    && (typeof(x.smoking) == 'string' || x.smoking === null);
}
