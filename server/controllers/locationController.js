import { dbStore } from '../data/store.js';

export const getLocations = async (req, res) => {
  try {
    const locations = dbStore.getLocations();
    return res.status(200).json({ success: true, locations });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving locations.' });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Location name is required.' });
    }

    const newLocation = dbStore.createLocation({
      name: name.trim(),
      description: (description || '').trim()
    });

    return res.status(201).json({ success: true, message: 'Location created.', location: newLocation });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating location.' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (isActive !== undefined) updates.isActive = Boolean(isActive);

    const updated = dbStore.updateLocation(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Location not found.' });
    }

    return res.status(200).json({ success: true, message: 'Location updated.', location: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating location.' });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.deleteLocation(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Location not found.' });
    }
    return res.status(200).json({ success: true, message: 'Location deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting location.' });
  }
};
