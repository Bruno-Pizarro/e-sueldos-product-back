import { Document, Model, Types } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IProduct {
  name: string;
  description: string;
  image?: string;
  userId: Types.ObjectId;
  price: number;
  stock?: Types.ObjectId;
}

export interface IProductDoc extends IProduct, Document {}

export interface IProductModel extends Model<IProductDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult<IProductDoc>>;
}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Omit<IProduct, 'userId' | 'stock'>;
