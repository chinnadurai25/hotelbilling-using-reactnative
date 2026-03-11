const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// @route   GET api/tables
// @desc    Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tables
// @desc    Add a new table
router.post('/', async (req, res) => {
  const { number, seats } = req.body;
  try {
    let table = await Table.findOne({ number });
    if (table) {
      return res.status(400).json({ msg: 'Table already exists' });
    }

    table = new Table({
      number,
      seats
    });

    await table.save();
    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/tables/:id
// @desc    Update table status/order
router.patch('/:id', async (req, res) => {
  const { status, currentOrder } = req.body;
  try {
    let table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ msg: 'Table not found' });

    if (status) table.status = status;
    if (currentOrder !== undefined) table.currentOrder = currentOrder;

    await table.save();
    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tables/:id
// @desc    Delete a table
router.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ msg: 'Table not found' });

    await Table.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Table removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
