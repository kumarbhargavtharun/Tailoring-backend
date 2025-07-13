const express = require('express');
const router = express.Router();
const pool = require('../db');

// Fetch orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Fetch error');
  }
});

// Next Customer ID
router.get('/next-custid', async (req, res) => {
  try {
    const result = await pool.query("SELECT custid FROM orders ORDER BY id DESC LIMIT 1");
    let nextCustId = 'A-1';

    if (result.rows.length > 0) {
      const [prefix, number] = result.rows[0].custid.split('-');
      const newNumber = parseInt(number) + 1;
      nextCustId = newNumber > 999 ? `${String.fromCharCode(prefix.charCodeAt(0) + 1)}-1` : `${prefix}-${newNumber}`;
    }

    res.json({ nextCustId });
  } catch (err) {
    res.status(500).send('CustID fetch error');
  }
});

// Submit order
router.post('/', async (req, res) => {
  const {
    custid, custname, phone, workamt, tailoramt, advance,
    worker, model, sarees, status, remarks, deliverydate, ordereddate
  } = req.body;

  try {
    await pool.query(`
      INSERT INTO orders 
      (custid, custname, phone, workamt, tailoramt, advance, worker, model, sarees, status, remarks, deliverydate, ordereddate)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    `, [custid, custname, phone, workamt || null, tailoramt || null, advance || null,
        worker, model, sarees, status, remarks || null, deliverydate, ordereddate]);

    res.send('Order submitted successfully');
  } catch {
    res.status(500).send('Submit error');
  }
});

// Update status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.send('Status updated');
  } catch {
    res.status(500).send('Status update error');
  }
});

module.exports = router;
