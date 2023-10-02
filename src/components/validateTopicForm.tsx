import { FormikErrors } from "formik";
import { TopicFormikValues } from "../models";
import { Topic } from "../store/topic";

interface Validate<T> {
    (values: T): FormikErrors<T>;
}

interface Validator<T> {
    (validate?: Validate<T>): Validate<T>;
}

const integerRe = /^[0-9]*$/i;

const validateMaxMessageSize: Validator<TopicFormikValues> = (validate) => (values) => {
    const errors = validate?.(values) || {};
    return !integerRe.test(values.advancedValues.maxMessageSize.toString())
        ? {
              ...errors,
              advancedValues: {
                  maxMessageSize: "Value must be positive integer",
                  ...errors.advancedValues,
              },
          }
        : errors;
};

const validateRetentionTime: Validator<TopicFormikValues> = (validate) => (values) => {
    const errors = validate?.(values) || {};
    return !integerRe.test(values.advancedValues.retentionTime.toString())
        ? {
              ...errors,
              advancedValues: {
                  retentionTime: "Value must be positive integer",
                  ...errors.advancedValues,
              },
          }
        : errors;
};

const validateRequired =
    (fields: (keyof Omit<TopicFormikValues, "advancedValues">)[]): Validator<TopicFormikValues> =>
    (validate) =>
    (values) =>
        fields.reduce(
            (errors, field) =>
                !values[field].length
                    ? {
                          [field]: "Required",
                          ...errors,
                      }
                    : errors,
            validate?.(values) || {},
        );

const validateTopic: Validator<TopicFormikValues> = (validate) => (values) => {
    const errors = validate?.(values) || {};
    if (Topic.splitName(values.topic).length > 1) {
        return {
            topic: `Name cannot contain "${Topic.GROUP_NAME_SEPARATOR}"`,
            ...errors,
        };
    }
    if (!/^[a-zA-Z0-9_.-]+$/i.test(values.topic)) {
        return {
            topic: "Invalid topic name",
            ...errors,
        };
    }
    return errors;
};

const validateSchema: Validator<TopicFormikValues> = (validate) => (values) => {
    const errors = validate?.(values) || {};
    try {
        const { type, name } = JSON.parse(values.schema);
        if (!type) return { schema: `Missing required "type"`, ...errors };
        if (!name) return { schema: `Missing required "name"`, ...errors };
    } catch (error) {
        return { schema: error.message, ...errors };
    }
    return errors;
};

function composeValidators<T>(validators: Validator<T>[]): Validate<T> {
    return validators.filter(Boolean).reduce(
        (errors, validator) => {
            return validator(errors);
        },
        (v: T) => ({}),
    );
}

export function validateTopicForm(values: TopicFormikValues, includeAdvanced: boolean): FormikErrors<TopicFormikValues> {
    const validate = composeValidators<TopicFormikValues>([
        validateRequired(["group", "topic", "description", "schema"]),
        validateTopic,
        validateSchema,
        includeAdvanced && validateMaxMessageSize,
        includeAdvanced && validateRetentionTime,
    ]);
    return validate(values);
}
