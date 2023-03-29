import { createConnection } from "mysql2/promise";

export default async function handler(req, res) {
  const sqlQuery = req.body.sqlQuery;

  try {
    // create connection to the MySQL database
    const connection = await createConnection({
      host: "imdb.c7j0ah4tozvf.eu-west-2.rds.amazonaws.com",
      user: "imdbuser",
      password: "tt3581920",
      database: "imdb",
    });

    // execute the SQL query and fetch the result
    const [rows, fields] = await connection.execute(sqlQuery);

    // close the connection to the MySQL database
    await connection.end();

    // send the query result as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
}