/** @format */

import * as Bcrypt from 'bcryptjs';
import { IsIn, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import ETable from '../../app/enum/table.enum';
import EUserStatus, { EUserRole } from '../../app/enum/user.enum';
import ModelEntity from './model.entity';

@Entity({ name: ETable.USERS })
class UserEntity extends ModelEntity<UserEntity> {
	@IsString()
	@Column({ type: 'citext' })
	public password: string;

	@IsString()
	@Column()
	public name: string;

	@IsString()
	@Column()
	public username: string;

	@IsString()
	@Column()
	public timezone: string;

	@IsIn(Object.values(EUserStatus))
	@Column()
	public status: EUserStatus;

	@IsIn(Object.values(EUserRole))
	@Column({ default: EUserRole.USER })
	public role: EUserRole;

	@BeforeInsert()
	public BeforeInsertHooks() {
		// Capitalizing each word of campaign name
		const splitStr = this.name.toLowerCase().split(' ');
		for (let i = 0; i < splitStr.length; i++) {
			// You do not need to check if i is larger than splitStr length, as your for does that for you
			// Assign it back to the array
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		// Directly return the joined string
		this.name = splitStr.join(' ');
		this.password = Bcrypt.hashSync(this.password, 10); // Hash password
		this.username = this.username.trim();
	}

	public toJSON(
		timezone = this.timezone,
		includes = ['id', 'name', 'username', 'timezone', 'status', 'createdAt', 'updatedAt'],
		skips = []
	): Partial<UserEntity> {
		const d = super.toJSON(timezone, includes, skips);

		return d;
	}
}

export default UserEntity;
