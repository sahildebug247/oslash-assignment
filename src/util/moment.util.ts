/** @format */

import MomentTz from 'moment-timezone';
import MOMENT_DEFAULT_FORMAT from '../app/constants/moment-format.constant';
import moment from 'moment';

export default class MomentUtil {
	public validTimezoneNames: string[];
	constructor() {
		this.validTimezoneNames = MomentTz.tz.names();
	}

	public static convertToDefaultTimezoneString(
		dateToConvert: Date,
		timezoneToConvertTo,
		format = MOMENT_DEFAULT_FORMAT
	): string {
		return MomentTz.tz(dateToConvert, timezoneToConvertTo).format(format);
	}
}
