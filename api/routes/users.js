const express = require('express');
const router = express.Router();


const mysqlconnection = require('../connection/connection');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  mysqlconnection.query('select id, username, correo, telefono from usuarios', (err, rows, fields) => {
    if (!err) {
      res.json(rows)
    } else {
      console.log(err);
    }
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  mysqlconnection.query('select id, username, correo, telefono from usuarios where id=?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows)
    } else {
      console.log(err);
    }
  })
});

router.post('/', (req, res) => {
  const { username, password, correo, telefono } = req.body;
  mysqlconnection.query(`insert into usuarios(username, password, correo, telefono, estatus, perfil_id) values('${username}','${password}','${correo}','${telefono}','1','1')  `, [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows)
    } else {
      console.log(err);
    }
  })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params

  mysqlconnection.query(`delete from usuarios where id = '${id}'`, (err, rows, fields) => {
    if (err) throw err
    else {
      res.json({ status: 'usuario eliminado' })
    } 
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { username, password, correo, telefono } = req.body;

  let sql = `update usuarios set 
              username ='${username}',
              password='${password}',
              telefono='${correo}',
              correo='${telefono}',
              where id = '${id}'`

  mysqlconnection.query(sql, (err, rows, fields) => {
    if (err) throw err
    else {
      res.json({ status: 'usuario modificado' })
    }
  })

})


router.post('/signin', (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;
  mysqlconnection.query('select username from usuarios where username=? and password=? ',
    [username, password],
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          let data = JSON.stringify(rows[0]);
          const token = jwt.sign(data, 'key');
          res.json({ token });
        } else {
          res.json("usuario o password incorrecto");
        }
      }
      else {
        console.log(err);
      }
    }
  );
});

router.post('/test', verifyToken, (req, res) => {
  res.json("información secretea");
});


function verifyToken(req, res, next) {
  if (!req.headers.authorization) return res.status(401).json("No Autorizado");

  const token = req.headers.authorization.substr(7);
  console.log(token);
  if (token !== '') {
    const content = jwt.verify(token, 'key');
    console.log(content);
    next();
  } else {
    res.status(401).json("Token Vacio");
  }

}


module.exports = router;