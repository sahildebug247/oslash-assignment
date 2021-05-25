/** @format */

import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import MomentUtil from '../../util/moment.util';

export declare type Diff<T extends string | symbol | number, U extends string | symbol | number> = ({
	[P in T]: P;
} &
	{
		[P in U]: never;
	} & {
		[x: string]: never;
	})[T];
export declare type Omit<T, K extends keyof T> = {
	[P in Diff<keyof T, K>]: T[P];
};
export declare type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};
export declare type NonAbstract<T> = {
	[P in keyof T]: T[P];
};

export type FilteredModelAttributes<T extends ModelEntity<T>> = RecursivePartial<
	Omit<T, keyof ModelEntity<any>>
> & {
	id?: string | any;
	createdAt?: Date | any;
	updatedAt?: Date | any;
};

export default class ModelEntity<T extends ModelEntity<T>> extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;
	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;
	@UpdateDateColumn({ name: 'updated_at' })
	public updatedAt: Date;

	constructor(values?: FilteredModelAttributes<T>) {
		super();
		Object.assign<{}, FilteredModelAttributes<T>>(this, values);
	}

	public toJSON(timezone = 'UTC', includes = [], skips = []) {
		const d: any = {};
		for (const key of includes) {
			d[key] = this[key];
		}

		for (const key of skips) {
			delete d[key];
		}

		d.id = this.id;
		d.createdAt = MomentUtil.convertToDefaultTimezoneString(this.createdAt, timezone);
		d.updatedAt = MomentUtil.convertToDefaultTimezoneString(this.updatedAt, timezone);
		return d;
	}
}
