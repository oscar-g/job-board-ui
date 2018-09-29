import { ObjectSchema, AnySchema } from 'joi';
import forms from '@oscar-g/job-board-schema';

interface IMap<T> {
  [k: string]: T;
}

export interface IFieldState {
  value: any|null;
  valid: boolean;
  dirty: boolean; // true when any input in the field (by user or prefilled)
  touched: boolean; // true when user has interacted with field
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
  schedule: IFormState;
  payment: IFormState;
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
      const flags: {
        default?: any;
      } = (schema as any)._flags;

      fieldState[key] = { ...initialFieldState };

      // initialize default value
      if ((schema as any)._flags.hasOwnProperty('default')) {
        if (typeof flags.default === 'function') {
          fieldState[key].value = flags.default();
        } else {
          fieldState[key].value = flags.default;
        }
      }
    });
  }

  return {
    schema: Object.freeze(formSchema),
    fieldState,
  };
};

export const initialFormState: IInitialFormState  = {
  job: getInitialFormState(forms.job),
  company: getInitialFormState(forms.company),
  schedule: getInitialFormState(forms.schedule),
  payment: getInitialFormState(forms.payment),
};
