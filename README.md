## Running the contact server
To start the server run the following commands:

### `npm install`
### `npm run build`

then go to the dist directory and run 
### `npm start`
(you can also run 'npm run local' in the main directory)

This runs the server at [http://localhost:3001](http://localhost:3001).

### you can run the following requests:
- [http://localhost:3001/api/contacts](http://localhost:3001/api/contacts)
- [http://localhost:3001/api/contacts?&offset=200](http://localhost:3001/api/contacts?&offset=200)
- [http://localhost:3001/api/contacts/search?&q=Tom](http://localhost:3001/api/contacts/search?&q=Tom)
