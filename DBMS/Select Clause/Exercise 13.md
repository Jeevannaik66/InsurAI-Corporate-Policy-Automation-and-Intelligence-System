# 📊 Product Table – Select Specific Columns

## 📜 Problem Statement  
Write a query to **list product ID, price, and category** for all products from the `Product` table.

## 🧩 Table Structure

| Column Name | Data Type | Description                     |
|-------------|-----------|---------------------------------|
| `Prodid`    | `INT`     | Unique Product ID               |
| `Pdesc`     | `VARCHAR` | Product Description             |
| `Price`     | `DECIMAL` | Product Price                   |
| `Category`  | `VARCHAR` | Product Category                |
| `Discount`  | `DECIMAL` | Discount Percentage (nullable)  |

## 💡 Explanation  
- The `SELECT` clause is used to retrieve specific columns from a table.  
- Column names must be separated by **commas**, not `and`.  
- This query returns only the `Prodid`, `Price`, and `Category` columns from the `Product` table.

## ✅ SQL Solution  
```sql
SELECT Prodid, Price, Category FROM Product;
