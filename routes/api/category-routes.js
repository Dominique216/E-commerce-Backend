const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData =  await Category.findAll({
      include: [{ model: Product }], 
    });
    res.status(200).json(categoryData);  
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const oneCategory = await Category.findByPk( req.params.id, {
      include: [{model: Product}],
    });
    res.status(200).json(oneCategory);  
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
  });

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updateCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCatecory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!deleteCatecory) {
      res.status(404).json('No category with that id.')
    }
    res.status(200).json(deleteCatecory)
  } catch (err) {
    res.status(500).json(err);
  }
  
});

module.exports = router;
