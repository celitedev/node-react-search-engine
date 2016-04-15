import { object, string } from 'yup';

const baseFields = {
  title: string().trim().max(100),
  subTitle: string().trim().max(500),
  collectionImg: string().trim().max(200),
  description: string().trim().max(200)
};

export const collectionDescriptionSchema = object().shape({
  ...baseFields
});
