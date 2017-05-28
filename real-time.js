const r = require('rethinkdb');

const log = console.log.bind(console);
const error = console.log.bind(console);
let connection = null;

r.connect({
  host: 'localhost',
  port: 32769,
}, (connectErr, conn) => {
  if (connectErr) error('connection-err', connectErr);

  connection = conn;

  log('Listening to real time feeds...');

    /* Real time feeds */
  r.table('authors')
    .changes()
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.each((cursorErr, row) => {
        if (err) error(cursorErr);

        log('\nreal-time-feeds - ');
        log(JSON.stringify(row, null, 2));
      });
    });
});
