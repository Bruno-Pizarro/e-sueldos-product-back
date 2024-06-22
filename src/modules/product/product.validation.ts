import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedProduct } from './product.interfaces';

const createProductBody: Record<keyof NewCreatedProduct, any> = {
  description: Joi.string().required(),
  image: Joi.any(),
  name: Joi.string().required(),
  price: Joi.number().required(),
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
  file: Joi.any(),
};

export const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      image: Joi.any(),
      name: Joi.string(),
      price: Joi.number(),
    })
    .min(1),
  file: Joi.any(),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};
