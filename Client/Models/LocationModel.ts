import { ElementType } from "./ElementType";

export default interface LocationModel {
  id: number;
  name: string;
  type: ElementType;
  lat: number;
  lon: number;
  smoking: string | null;
}
