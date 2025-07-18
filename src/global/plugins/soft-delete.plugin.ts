import { Logger } from '@nestjs/common';
import { Schema } from 'mongoose';

export function softDeletePlugin(schema: Schema) {
  // Add a `deletedAt` field to mark the deletion time
  schema.add({ deletedAt: { type: Date, default: null } });

  // Custom method to soft delete a document
  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.statics.softDelete = function (filter: Record<string, any>) {
    return this.findOne(filter).then((doc) => {
      if (doc) {
        return doc.softDelete();
      }
      return null;
    });
  };

  // Custom static method to soft delete multiple documents
  schema.statics.softDeleteMany = async function (filter: Record<string, any>) {
    const { modifiedCount, ...rest } = await this.updateMany(filter, {
      deletedAt: new Date(),
    });

    return {
      ...rest,
      deletedCount: modifiedCount,
    };
  };

  // Override the default `find` and `findOne` methods to filter out deleted documents
  schema.pre('find', function () {
    this.where({ deletedAt: null });
    this.sort({ _id: 1 });
  });

  schema.pre('findOne', function () {
    this.where({ deletedAt: null });
  });

  schema.pre('updateMany', function () {
    this.where({ deletedAt: null });
  });

  // Override the default `countDocuments` method to filter out deleted documents
  schema.pre('countDocuments', function () {
    this.where({ deletedAt: null });
  });

  Logger.log('Pligin initialized', 'SoftDeletePlugin');
}
