const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/vidly')
    .catch(err => console.log('Error:', err));

mongoose.connection.on('connected', () => {
    console.log(`Connected to Database ${mongoose.connection.name}`);
});

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customers = await Customer.findById(req.params.id);
    if(!customers) return res.status(404).send('Customer with specified id does not exist.');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) {return res.status(400).send(error.details[0].message)}

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', async (req,res) => {
    const { error } = validateData(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        },
        {new: true}
    );
    if(!customer) return res.status(404).send('Customer with the specified id does not exist.');
    res.send(customer);

});

router.delete('/:id', async (req,res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send('Customer with specified id does not exist');
    res.send(customer);
});

module.exports = router;