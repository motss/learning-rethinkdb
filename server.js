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

        log('\nretrive-documents - ');
        log(JSON.stringify(result, null, 2));
      });
    });

  /* Filter documents based on condition */
  r.table('authors')
    .filter(r.row('name').eq('WIlliam Adaam'))
    .filter(r.row('posts').count().gt(2))
    .filter(r.row('tv_show').gt('Battlestar'))
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        if (cursorErr) error(err);

        log('\nfilter-documents - ');
        log(JSON.stringify(result, null, 2));
      });
    });

  /* Retrieve documents by primary key */
  r.table('authors')
    .get('3a90dee2-68e0-4a74-9d4a-ac2f2294466c')
    .run(connection, (err, result) => {
      if (err) error(err);

      log('\nretrieve-documents-by-primary-key - ');
      log(JSON.stringify(result, null, 2));
    });

  /* Update documents */
  r.table('authors')
    .update({ type: 'fictional' })
    .run(connection, (err, result) => {
      if (err) error(err);

      log('\nupdate-documents - ');
      log(JSON.stringify(result, null, 2));
    });

  r.table('authors')
    .filter(r.row('name').eq('WIlliam Adaam'))
    .update({ rank: 'Admiral' })
    .run(connection, (err, result) => {
      if (err) error(err);

      log('\nupdate-documents-with-filtering - ');
      log(JSON.stringify(result, null, 2));
    });

  r.table('authors')
    .filter(r.row('name').eq('WIlliam Adaam'))
    .update({
      posts: r.row('posts').append({
        title: 'Shakespeare',
        content: 'What a piece of work is man...',
      }),
    })
    .run(connection, (err, result) => {
      if (err) error(err);

      log('\nappend rows - ');
      log(JSON.stringify(result, null, 2));
    });

  r.table('authors')
    .filter(r.row('name').eq('WIlliam Adaam'))
    .update({
      name: 'William Adama',
    })
    .run(connection, (err, result) => {
      if (err) error(err);

      log('\nupdate name - ');
      log(JSON.stringify(result, null, 2));
    });


  /* Using secondary indexes */
  // r.table('authors')
  //   // .indexCreate('name')
  //   .run(connection, (err, result) => {
  //     if (err) error(err);

  //     log('\nusing-secondary-indexes - ');
  //     log(JSON.stringify(result, null, 2));
  //   });

  /* Querying */
  r.table('authors')
    // .getAll('William Adama', { index: 'name' })
    // .getAll('Janes', 'William Adama', { index: 'name' })
    // .between('Lewis', 'William Adama', { index: 'name' })
    .orderBy({ index: 'name' })
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        log('\nquerying - ');
        log(JSON.stringify(result, null, 2));
      });
    });

  /* Compound indexes */
  // r.table('authors')
  //   .indexCreate('name_rank', [
  //     r.row('name'),
  //     r.row('rank'),
  //   ])
  //   .run(connection, (err, result) => {
  //     if (err) error(err);

  //     log('\ncompound indexes - ');
  //     log(JSON.stringify(result, null, 2));
  //   });
  r.table('authors')
    // .getAll([
    //   'William Adama',
    //   'Admiral',
    // ], { index: 'name_rank' })
    // .getAll([
    //   ['Paul Lewis', 'William Adama'],
    //   ['Sergeant', 'Admiral'],
    // ], { index: 'name_rank' })
    .orderBy({ index: 'name_rank' })
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        log('\nget all users with multiple fields - ');
        log(JSON.stringify(result, null, 2));
      });
    });

  /* Multiple indexes */
  // r.table('authors')
  //   .indexDrop('posts');

  /* Query row inside posts array */
  // r.table('authors')
  //   .indexCreate('posts_content', r.row('posts')('content'), { multi: true })
  //   .run(connection, (err, result) => {
  //     if (err) error(err);

  //     log(JSON.stringify(result, null, 2));
  //   });

  /* Query multiple fields inside posts array */
  // r.table('authors')
  //   .indexCreate('posts_content_title', (author) => {
  //     return author('posts').map(post => ([
  //       post('content'),
  //       post('title'),
  //     ]));
  //   }, { multi: true })
  //   .run(connection, (err, result) => {
  //     if (err) error(err);

  //     log(JSON.stringify(result, null, 2));
  //   });

  r.table('authors')
    // .getAll('What a piece of work is man...', { index: 'posts_content' })
    .getAll(['What a piece of work is man...', 'Shakespeare'], { index: 'posts_content_title' })
    .distinct()
    .run(connection, (err, cursor) => {
      if (err) error(err);

      cursor.toArray((cursorErr, result) => {
        if (cursorErr) error(cursorErr);

        log('\nquerying multiple indexes - ');
        log(JSON.stringify(result, null, 2));
      });
    });
});
