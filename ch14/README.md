Chapter 14
---
In Chapter 14, I learned about retrieving, updating and inserting documents into a collection in MongoDB using Node.js.

In the book that I am referencing, Node.js, MongoDB and AngularJS Web Development, this chapter breaks all of the code into multiple files. I decided to code all of the files into one giant document.js and just pass a parameter to access whichever example I needed. Here's how that works:

How to use document.js:
--
In console run: <code> node document.js [parameter] </code>

List of Possible Parameters:
* **create** - Equivalent to *doc_insert.js*  - Inserts documents into a collection
* **find** - Equivalent to *doc_find.js*  - Find documents in a collection
* **update** - Equivalent to *doc_update.js*  - Update multiple documents in the database
* **list** - I created a custom method here based on what I learned in CH 13 to list the collections for this DB
* **save** - Equivalent to *doc_save.js*  - Saving a document to a collection (book's method was deprecated)
* **upsert** - Equivalent to *doc_upsert.js*  - Update or insert a document into a collection
* **deleteM** - Equivalent to *doc_delete.js*  - Delete multiple documents from a collection
* **deleteO** - Equivalent to *doc_one.js*  - Delete a single document from a collection