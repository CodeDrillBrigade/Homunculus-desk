import {Metric} from "./Metric";

export interface BoxUnit {
	quantity: number,
	metric?: Metric,
	boxUnit?: BoxUnit,
}