import { ObjectSchema, AnySchema } from 'joi';
import { jobFormSchema, userFormSchema, companyFormSchema } from '@oscar-g/job-board-schema';

interface IMap<T> {
  [k: string]: T;
}

export interface IFieldState {
  value: any|null;
  valid: boolean;
  dirty: boolean; // true when any input in the field (by user or prefilled)
  touched: boolean; // true when user has interacted with field
  // @todo implement focus
  focused: boolean; // true when field is focused
  errors: IMap<string>;
}

// Joi error
export interface IValidationErrorDetails {
  type: string;
  message: string;
  context: {
    key: string,
  };
}

export interface IFormState {
  schema: ObjectSchema;
  fieldState: IMap<IFieldState>;
}

export interface IInitialFormState {
  job: IFormState;
  company: IFormState;
}

export interface ISchemaChild {
  key: string;
  schema: AnySchema;
}

export type FormName = keyof IInitialFormState;

export const initialFieldState: IFieldState = {
  value: null,
  valid: false,
  dirty: false,
  touched: false,
  focused: false,
  errors: {},
};

export const getSchemaChildren = (schema: ObjectSchema): ISchemaChild[] => {
  if (schema.hasOwnProperty('_inner') && (schema as any)._inner.hasOwnProperty('children')) {
    return (schema as any)._inner.children as ISchemaChild[];
  }

  return [];
};

export const getInitialFormState = (formSchema: ObjectSchema): IFormState => {
  const fieldState: IMap<IFieldState> = {};

  if ((formSchema as any)._inner) {
    // set up initial state for child fields
    const schemaChildren = getSchemaChildren(formSchema);

    schemaChildren.forEach(({key, schema}) => {
      fieldState[key] = { ...initialFieldState };

      // initialize default value
      if ((schema as any)._flags.hasOwnProperty('default')) {
        console.log('default',  (schema as any)._flags.default)
        fieldState[key].value = (schema as any)._flags.default;
      }
      // console.log(schema)
    });
  }

  return {
    schema: Object.freeze(formSchema),
    fieldState,
  };
};

export const initialFormState: IInitialFormState  = {
  job: getInitialFormState(jobFormSchema),
  company: getInitialFormState(companyFormSchema),
};
