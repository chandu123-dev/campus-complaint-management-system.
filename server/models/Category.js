// Mongoose schema definition for Category
export const CategorySchemaDefinition = {
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
};

export default CategorySchemaDefinition;
