import { object, string } from 'yup';

const baseFields = {
  html: string().trim().max(200).required('This field is required.'),
  css: string().trim().max(500),
  jsServer: string().trim().max(200)
};

const modelListFields = {
  ...baseFields,
  jsClient: string().trim().max(200)
};

export const layoutTwigSchema = object().shape({
  ...baseFields
});

export const modelListSchema = object().shape({
  ...modelListFields
});
