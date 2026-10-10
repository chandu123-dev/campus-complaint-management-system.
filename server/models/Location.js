// Mongoose schema definition for Location
export const LocationSchemaDefinition = {
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
};

export default LocationSchemaDefinition;
