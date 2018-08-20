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

export interface IFormState {
  schema: ObjectSchema;
  fieldState: IMap<IFieldState>;
}

export interface IInitialFormState {
  job: IFormState;
  company: IFormState;
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

export const getInitialFormState = (schema: ObjectSchema): IFormState => {
  const fieldState: IMap<IFieldState> = {};

  if ((schema as any)._inner) {
    // set up initial state for child fields
    const schemaChildren: Array<{
      key: string,
      schema: AnySchema,
    }> = (schema as any)._inner.children;

    schemaChildren.forEach(({key}) => {
      fieldState[key] = { ...initialFieldState };
    });
  }

  return {
    schema: Object.freeze(schema),
    fieldState,
  };
};

export const initialFormState: IInitialFormState  = {
  job: getInitialFormState(jobFormSchema),
  company: getInitialFormState(companyFormSchema),
};
