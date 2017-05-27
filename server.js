const r = require('rethinkdb');

const log = console.log.bind(console);
const error = console.error.bind(console);
let connection = null;

/* Open connection */
r.connect({
  host: 'localhost',
  port: 32769,
}, (connectErr, conn) => {
  if (connectErr) error('connection-error', connectErr);

  connection = conn;

  /* Create a new table */
  // r.db('test') // Defaults to 'test'.
  //   .tableCreate('authors')
  //   .run(connection, (err, result) => {
  //     if (err) error('create-error', err);

  //     log(JSON.stringify(result, null, 2));
  //   });

  /* Insert data */
  // r.table('authors')
  //   .insert([
  //     {
  //       name: 'WIlliam Adaam',
  //       tv_show: 'Battlestar Galactica',
  //       posts: [
  //         { title: 'Decommissioning speech', content: 'The Cylon War is long ever...' },
  //         { title: 'We are at war', content: 'Moments ago, this ship received war...' },
  //         { title: 'The new Earth', content: 'The discoveries of the past few days...' },
  //       ],
  //     },
  //   ])
  //   .run(connection, (err, result) => {
  //     if (err) error(err);

  //     log(JSON.stringify(result, null, 2));
  //   });

  /* Retrieve documents */
  r.table('authors')
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        if (cursorErr) error(cursorErr);

        log(JSON.stringify(result, null, 2));
      });
    });

  /* Filter documents absed on condition */
  r.table('authors')
    .filter(r.row('name').eq('WIlliam Adaam'))
    .filter(r.row('posts').count().gt(2))
    .filter(r.row('tv_show').gt('Battlestar'))
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        if (cursorErr) error(err);

        log(JSON.stringify(result, null, 2));
      });
    });

  /* Retrieve documents by primary key */
  r.table('authors')
    .get('3a90dee2-68e0-4a74-9d4a-ac2f2294466c')
    .run(connection, (err, result) => {
      if (err) error(err);

      log(JSON.stringify(result, null, 2));
    });
});
