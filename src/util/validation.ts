import moment, {Moment, MomentBuiltinFormat} from "moment";

/**
 * Validates a string to ensure it is not empty.
 *
 * @param {string} string - The string to validate.
 * @param {any} alt - The value to return if the string is empty.
 * @param {() => void} [callback=() => {}] - A callback function to execute if the string is empty.
 *
 * @returns {string | any} - Returns the string if it is not empty, otherwise returns the alt value.
 */
export function validateStringNotEmpty(string: string, alt: any, callback: () => void = () => {}): string | any {
    if (string === '') {
        callback();

        return alt;
    }

    return string;
}

/**
 * Validates a string to ensure it is a valid email address.
 *
 * @param {string} string - The string to validate.
 * @param {any} alt - The value to return if the string is an invalid email address.
 * @param {() => void} [callback=() => {}] - A callback function to execute if the string is an invalid email address.
 *
 * @returns {string | any} - Returns the email address if it is valid, otherwise returns the alt value.
 */
export function validateEmailAddress(string: string, alt: any, callback: () => void = () => {}): string | any {
    if (!string ||
        // Regex obtained from here: https://github.com/angular/angular.js/blob/65f800e19ec669ab7d5abbd2f6b82bf60110651a/src/ng/directive/input.js
        !/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(string)) {

        callback();

        return alt;
    }

    return string;
}

/**
 * Validates a date string to ensure it is in the past and in the correct format.
 *
 * @param {any} date - The date string to validate.
 * @param {any} alt - The value to return if the date is invalid or in the future.
 * @param {string | MomentBuiltinFormat} format - The format of the date string.
 * @param {() => void} [callback=() => {}] - A callback function to execute if the date is invalid or in the future.
 *
 * @returns {Moment | any} - Returns a Moment object if the date is valid and in the past, otherwise returns the alt value.
 */
export function validatePastDateString(date: any, alt: any, format: string | MomentBuiltinFormat,
                                       callback: () => void = () => {})
    : Moment | any {

    date = moment(date, format, true);

    if (!date.isValid() || date.isAfter(moment(), 'day')) {
        callback();

        return alt;
    }

    return date;
}

