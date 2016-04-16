import { object, string } from 'yup';

const collectionFilds = {
  title: string().trim().max(100),
  subTitle: string().trim().max(100),
  description: string().trim().max(500)
};

const cardFields = {
  desc: string().trim().max(300)
};

export const cardSchema = object().shape({
  ...cardFields
});

export const collectionSchema = object().shape({
  ...collectionFilds
});
