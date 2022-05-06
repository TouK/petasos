interface Field {
  name: string;

  [key: string]: any;
}

interface Schema {
  fields: Field[];

  [key: string]: any;
}

const metadataField: Field = {
  name: "__metadata",
  type: [
    "null",
    {
      type: "map",
      values: "string",
    },
  ],
  default: null,
  doc: "Field used in Hermes internals to propagate metadata like hermes-id",
};

const withMetadata = (fields: Field[]): Field[] => fields.concat(metadataField);

const notMetadata = ({ name }: Field): boolean => name !== metadataField.name;

export const addMetadata = (schemaString: string): string => {
  try {
    const { fields = [], ...jsonSchema } = JSON.parse(schemaString);
    return JSON.stringify({
      fields: withMetadata(fields),
      ...jsonSchema,
    });
  } catch {
    return schemaString;
  }
};

export function withoutMetadataFields(schemaJson: Schema) {
  const { fields = [], ...jsonSchema } = schemaJson;
  return {
    ...jsonSchema,
    fields: fields.filter(notMetadata),
  };
}

export function withoutMetadata(jsonString: string): string {
  try {
    const { __metadata, ...jsonSchema } = JSON.parse(jsonString);
    return JSON.stringify(jsonSchema);
  } catch {
    return jsonString;
  }
}
