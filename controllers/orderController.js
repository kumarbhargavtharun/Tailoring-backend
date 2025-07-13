const { poolPromise, sql } = require("../db");

let custCounter = 1;

const generateCustId = () => `A-${custCounter++}`;

exports.addOrder = async (req, res) => {
  const { custname, phone, workamt, tailoramt, advance, worker, model, sarees, status, remarks, deliverydate } = req.body;
  const custid = generateCustId();

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("custid", sql.VarChar, custid)
      .input("custname", sql.VarChar, custname)
      .input("phone", sql.VarChar, phone)
      .input("workamt", sql.Int, workamt)
      .input("tailoramt", sql.Int, tailoramt)
      .input("advance", sql.Int, advance)
      .input("worker", sql.VarChar, worker)
      .input("model", sql.VarChar, model)
      .input("sarees", sql.VarChar, sarees)
      .input("status", sql.VarChar, status)
      .input("remarks", sql.VarChar, remarks)
      .input("deliverydate", sql.Date, deliverydate)
      .query(`INSERT INTO Orders VALUES (@custid, @custname, @phone, @workamt, @tailoramt, @advance, @worker, @model, @sarees, @status, @remarks, @deliverydate)`);

    res.status(201).json({ custid, message: "Order added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Orders");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.VarChar, id)
      .input("status", sql.VarChar, status)
      .query("UPDATE Orders SET status = @status WHERE custid = @id");

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
