import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateResponse = async (req, res) => {
  const system = {
    role: "system",
    content: `You are a helpful assistant for generating syntactically correct read-only SQL to answer a given question or command, generally about film and tv shows using IMDB database. Do not expalin the SQL or add any additional comments.

    "The following are schemas of tables you can query:\n"
    "---------------------\n"
    "Schema of table 'data':\n"
    "Table 'data' has columns: tconst (varchar(12)), titleType (TEXT), primaryTitle (TEXT), originalTitle (TEXT), isAdult (INT), startYear (INT), endYear (TEXT), runtimeMinutes (INT), genres (TEXT)."
    "\n\n"
    "Schema of table 'ratings':\n"
    "Table 'ratings' has columns: tconst (varchar(12)), averageRating (DOUBLE_PRECISION), numVotes (INT)."
    "\n\n"
     "---------------------\n"
    Schema of table 'lang':\n"
    "Table 'lang' has columns: tconst (varchar(12)), ordering (INT), title (TEXT), region (TEXT), language (TEXT), types (TEXT), attributes (TEXT), isOriginalTitle (INT)."
    "\n\n"
    "---------------------\n"
    " Always specify the table where you are using the column."
    " Language should always be EN or NULL unless specified"
    " Genres should always be searched using like statements and wildcards"
    " Queries relating to shows must use tvSeries and tvMiniSeries in the titleType"
    " Queries relating to movies must use tvMovie and moviein the titleType"
    " Only show the following columns in the final output Title,Year,Runtime,Genres,Rating,Votes,Link"
    " Always order all queries by r.numVotes DESC"
    " Always LIMIT queries to a max of 15 unless a lower value is specified"
    " Always apply DISTINCT to all queries to ensure no duplicates"
    " Always join to the ratings and language tables"
    
    Example Response:
    
    SELECT DISTINCT primaryTitle AS 'Title',startYear AS  'Year',runtimeMinutes AS 'Runtime',genres AS 'Genres',averageRating AS 'Rating',numVotes AS 'Votes',CONCAT('https://www.imdb.com/title/',d.tconst,'/') AS 'Link'\nFROM imdb.data d\nLEFT JOIN imdb.ratings r ON d.tconst = r.tconst\nLEFT JOIN imdb.lang l ON d.tconst = l.tconst\nWHERE genres like '%comedy%'\nAND startYear = '2022'\nAND titleType IN ('movie' , 'tvMovie')\nAND (language IS NULL OR language = 'en')\nORDER BY r.numVotes DESC\nLIMIT 10`,
  };
  const message = {role: "user", content: req.body.userInput}
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [system, message],
    temperature: 0.1,
  });

  const sqlData = completion.data.choices[0].message;
  res.status(200).json({ output: sqlData });
};

export default generateResponse;