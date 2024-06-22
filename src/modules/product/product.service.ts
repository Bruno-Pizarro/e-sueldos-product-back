import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { unlinkSync } from 'fs';
import publisher from '../../rabbitmq/publisher';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IProductDoc, NewCreatedProduct, UpdateProductBody } from './product.interfaces';
import Product from './product.model';
import { logger } from '../logger';

/**
 * Create a product
 * @param {NewCreatedProduct} productBody
 * @param {string} userId
 * @returns {Promise<IProductDoc>}
 */
export const createProduct = async (productBody: NewCreatedProduct, userId: string): Promise<IProductDoc> => {
  const product = await Product.create({ ...productBody, userId });
  await publisher.publishEvent('products.create', product);
  return product.populate('stock', 'quantity');
};

/**
 * Query for products<
 * @param {Object} filter - Mongo filter
 * @param {IOptions} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<IProductDoc>> => {
  const products = await Product.paginate(filter, {
    ...options,
    populate: 'stock',
    populateSelect: 'quantity',
  });
  return products;
};

/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> =>
  Product.findById(id).populate('stock', 'quantity');

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @param {string} userId
 * @returns {Promise<IProductDoc | null>}
 */
export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  updateBody: UpdateProductBody,
  userId: string
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, { ...updateBody, userId });
  await product.save();
  await publisher.publishEvent('products.update', product);
  return product.populate('stock', 'quantity');
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.image) {
    try {
      unlinkSync(product.image);
    } catch (error) {
      logger.error(`Failed to delete image: ${product.image}`, error);
    }
  }
  await product.deleteOne();
  await publisher.publishEvent('products.delete', product);
  return product;
};
