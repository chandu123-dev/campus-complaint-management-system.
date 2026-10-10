import { dbStore } from '../data/store.js';

export const getCategories = async (req, res) => {
  try {
    const categories = dbStore.getCategories();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving categories.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const newCategory = dbStore.createCategory({
      name: name.trim(),
      description: (description || '').trim()
    });

    return res.status(201).json({ success: true, message: 'Category created.', category: newCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating category.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (isActive !== undefined) updates.isActive = Boolean(isActive);

    const updated = dbStore.updateCategory(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.status(200).json({ success: true, message: 'Category updated.', category: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating category.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting category.' });
  }
};
