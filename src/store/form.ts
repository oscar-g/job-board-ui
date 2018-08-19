import { ObjectSchema } from 'joi';
import { jobFormSchema, userFormSchema, companyFormSchema } from '@oscar-g/job-board-schema';

export interface IFormData {[k: string]: any; }

export interface IFormState {
  schema: ObjectSchema;
  data: IFormData;
}

export interface IAllForms {
  job: IFormState;
  user: IFormState;
  company: IFormState;
}

export type FormName = keyof IAllForms;

export const initialFormState: IAllForms = {
  job: {
    schema: Object.freeze(jobFormSchema),
    data:  {} as IFormData,
  },
  user: {
    schema: Object.freeze(userFormSchema),
    data: {} as IFormData,
  },
  company: {
    schema: Object.freeze(companyFormSchema),
    data: {} as IFormData,
  },
};
