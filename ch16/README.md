Chapter 16
---
Chapter 16 is switching to using Mongoose instead of the native driver for Node.js

Notes/Description of files:
* **mongoose_connect.js** - Connect to MongoDB with Mongoose (refactored from book to work)
* **mongoose_find.js** - count() is deprecated so I had to refactor using estimatedDocumentCount() and count.length to return the proper count.
* **mongoose_create.js** - Use the save() and create() methods to add documents to MongoDB
* **mongoose_find_create.js** - This is not a book example, I created this for more practice and to check that the words in mongoose_create were actually in the database by performing a find query on them with mongoose
* **mongoose_update_one.js** - Find and Update one document using the update() method
* **mongoose_update_many.js** - Find and Update many documents using the update() method. I also added custom code to iterate through and revert the documents back to original after the update.
* **mongoose_remove_one.js** - Remove one item from the DB using Mongoose
* **mongoose_remove_many.js** - Remove many documents from the DB using Mongoose
* **mongoose_aggregate.js** - Use the aggregation framework with mongoose
* **mongoose_validation.js** - Validate against the schema before performing a save
*