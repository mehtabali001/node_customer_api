const express = require('express');
const router = express.Router();
const cors = require('cors');
const Customers = require('../models/Customers');
const { json } = require( 'body-parser' );



router.get('/customers',cors(), async (req, res) => {
  try {
    const customers = await Customers.find()
      res.status(200).json(customers)
  } catch (err) {
    console.error(err)
    res.status(404).send('404 error')
  }
})

router.post('/customers/add',cors(), async (req, res) => {
  const customer = new Customers(req.body);
  try {
  
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.age) {
      res.status(301).send({ msg: 'Please enter all fields' });
    }

    // let customer = Customers.findOne({ email: req.body.email });
    // if(customer){
    //   res.status(301).send({ msg: 'Email already exist.' });
    // }
  
      await customer.save();
      res.status(201).send(customer);
  } catch (error) {
      res.status(500).send(error);
  }
})


router.patch('/customers/:id', cors(), async (req, res) => {
  try {
      const customer = await Customers.findByIdAndUpdate(req.params.id, req.body, {new: true});
      if (!customer) {
          return res.status(404).send();
      }
      res.status(200).send(customer);
  } catch (error) {
      res.status(500).send(error);
  }
})


router.delete('/customers/:id', async (req, res) => {
  try {
      const customer = await Customers.findByIdAndDelete(req.params.id);
      if (!customer) {
          return res.status(404).send();
      }
      res.send(customer);
  } catch (error) {
      res.status(500).send(error);
  }
})



module.exports = router;