Chapter 15
---
In Chapter 15, I learned about accessing MongoDB from Node.js using the MongoClient. The doc_group.js has deprecated the group function so I spent several days refactoring all of that code into the new aggregation framework (other examples also seen in the doc_aggregate.js)
As I am most familiar with SQL Server, I consistently left notes for myself to show how the MongoDB syntax would relate to a SQL Server Query.

Description of the files:
* **generate_data.js** - This is the file to fill the collection with all 4000+ documents (was found in the Ch16 source code for the book)
* **doc_query.js** - Querying the collection for certain items (like SELECT ... WHERE ...)
* **doc_count.js** - Counting the documents in a collection (like SELECT count(*) FROM ...)
* **doc_fields.js** - Selecting certain attributes from a document to return (like SELECT a, b FROM ...)
* **doc_limit.js** - Limiting the number of documents returned (like SELECT TOP 5 * FROM ...)
* **doc_paging.js** - Return a page of results at a time
* **doc_sort.js** - Sort the documents returned (like SELECT ... ORDER BY ...)
* **doc_distinct.js** - Search for distinct values in a collection (like SELECT DISTINCT ...
* **doc_group.js** - Group results by something. Group is deprecated and aggregation is the new function (like SELECT ... GROUP BY ...)
* **doc_group_refactored.js** - Group results by something. I went through each book example and refactored it into the new aggregation framework
* **doc_group_aggregate.js** - Using the aggregation framework, had to refactor as the return function was in the wrong spot and returning invalid results
