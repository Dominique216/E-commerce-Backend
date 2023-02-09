const router = require('express').Router();
// const { response } = require('express');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagsData = await Tag.findAll({
      include: [{model: Product, through: ProductTag}], 
    });
    res.status(200).json(tagsData) 
  } 
  catch(err) {
    console.log(err)
    res.status(500).json(err)
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const oneTag = await Tag.findByPk(req.params.id, {
      include: [{model:Product, through: ProductTag}], 
    })
    res.status(200).json(oneTag)

  } 
  catch(err) {
    res.status(500).json(err)
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      if(req.body.productIds.length) {
        const tagArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id 
          };
        });
        return ProductTag.bulkCreate(tagArr);
      }
    })
    .then((alltagIds) => res.status(200).json(alltagIds)) 
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
    
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id:req.params.id,
    }
  })
    .then((product) => {
      return ProductTag.findAll({where: {tag_id: req.params.id}})
    })
    .then((pT) => {
      const currProducts = pT.map(({product_id}) => product_id);
      
      const newProducts = req.body.productIds
      .filter((product_id) => !currProducts.includes(product_id))
      .map((product_id) => {
        return {
          tag_id: req.params.id, 
          product_id,
        };
      });
      const toBeRemoved = pT
      .filter(({product_id}) => !req.body.productIds.includes(product_id))
      .map(({id})=> id);
      return Promise.all([
        ProductTag.destroy({where: {id: toBeRemoved}}), 
        ProductTag.bulkCreate(newProducts)
      ]);
    })
    .then((updatedTags => res.status(200).json(updatedTags)))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json(deleteTag)
  } 
  catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
