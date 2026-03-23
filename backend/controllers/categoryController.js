import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    if (!name || !type || !color) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const category = await Category.create({
      user: req.user._id,
      name,
      type,
      color
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
