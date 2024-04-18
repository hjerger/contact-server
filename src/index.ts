import express, { Request, Response } from "express"
import cors from "cors"
import knex from "knex"

const PORT = process.env.PORT || 3001
const DB_FILE = process.env.DB_FILE || "./contacts.db"

const app = express()
app.use(express.json())
app.use(cors())

const db = knex({
  client: "sqlite3",
  connection: {
    filename: DB_FILE,
  },
})

app.get("/api/contacts", (req, res) => {
  const offset: number = parseInt(req.query.offset as string, 10) || 0
  db("contacts")
    .select("*")
    .offset(offset)
    .limit(100)
    .then((results) => {
      return res.json(results)
    })
})
app.get("/api/contacts/search", (req, res) => {
  if (req.query.q) {
    db("contacts")
      .select("*")
      .where("firstName", "like", `%${req.query.q}%`)
      .orWhere("lastName", "like", `%${req.query.q}%`)
      .then((results) => {
        return res.json(results)
      })
  } else {
    res.status(400).json({ error: "Please send a query string parameter 'q'" })
  }
})
app.put("/api/contacts/:id", (req, res) => {
  if (req.params.id) {
    db("contacts")
      .where("id", "=", req.params.id)
      .update(req.body)
      .returning("*")
      .then(() => {
        return db("contacts").where("id", "=", req.params.id).select("*")
      })
      .then((contact) => {
        return res.json(contact)
      })
      .catch((err) => {
        if (err.code == "SQLITE_ERROR") {
          res.status(400).json({ message: err.message })
        }
      })
  }
})

app.delete("/api/contacts/:id", (req, res) => {
  if (req.params.id) {
    db("contacts")
      .where("id", "=", req.params.id)
      .del()
      .then(() => {
        return res
          .status(200)
          .json({ message: `deleted user ${req.params.id}` })
      })
      .catch((err) => {
        if (err.code == "SQLITE_ERROR") {
          res.status(400).json({ message: err.message })
        }
      })
  }
})

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Contact Server" })
})

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

export default server
