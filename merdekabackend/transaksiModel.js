const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "192.168.1.55",
  database: "postgres",
  password: "m3rd3k445",
  port: 5433,
});



const getBotol = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT row_number() over(order by namabotol) no,* FROM masterbotol order by namabotol", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};


//get all agen our database
const getSumAgen = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("select * from (select a.id id, a.namaagen namaagen, to_char( tanggal, 'DD-MM-YYYY') tanggal, sum(jumlah) as jumlah from agen a left join member m on a.id=m.sekolahid left join transaksibotol t on t.memberid = m.id group by to_char( tanggal, 'DD-MM-YYYY') ,a.id) as sum where jumlah is not null;", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};


const getAgen = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM transaksibotol order by transaksi_id desc", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};
//create a new agen record in the databsse
const createAgen = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, password, email, jenis } = body;
    pool.query(
      "INSERT INTO agen (namaagen, password, emailagen, jenisagen) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, password, email, jenis],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new Agen has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
//delete a agen
const deleteAgen = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM agen WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Agen telah dihapus ID: ${id}`);
      }
    );
  });
};
//update a agen record
const updateAgen = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { name, password, email } = body;
    pool.query(
      "UPDATE agen SET name = $1, password = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, password, email, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`Agen updated: ${JSON.stringify(results.rows[0])}`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
module.exports = {
  getBotol,
  getSumAgen,
  getAgen,
  createAgen,
  deleteAgen,
  updateAgen
}; 