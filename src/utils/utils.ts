import React from "react";

/**
 * Value stored in FormData entries (string or File)
 */
export type FormDataValue = FormDataEntryValue;

/**
 * Resulting object from converting FormData to a plain object.
 * Repeated keys become arrays of values.
 */
export type FormDataObject = Record<string, FormDataValue | FormDataValue[]>;

/**
 * Convert a FormData instance into a plain object.
 * Repeated keys become arrays of values.
 *
 * @example
 * const data = new FormData();
 * data.append('name', 'Alice');
 * data.append('tags', 'a');
 * data.append('tags', 'b');
 * const obj = FormDataToObject(data);
 * // { name: 'Alice', tags: ['a','b'] }
 */
export function FormDataToObject<T extends FormDataObject = FormDataObject>(formData: FormData): T {
    const temp: FormDataObject = {};
    formData.forEach((value, key) => {
        if (key in temp) {
            const existing = temp[key];
            if (Array.isArray(existing)) {
                existing.push(value);
            } else {
                temp[key] = [existing, value];
            }
        } else {
            temp[key] = value;
        }
    });
    return temp as T;
}

export const IsForm = (content: React.ReactNode): boolean => React.isValidElement(content) && (content.type === 'form' || (typeof content.type === 'string' && content.type.toLowerCase() === 'form'))
