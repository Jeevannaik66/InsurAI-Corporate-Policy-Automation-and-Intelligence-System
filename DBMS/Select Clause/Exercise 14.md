# 📊 Product Table – Select Unique Categories

## 📜 Problem Statement  
Write a query to **list all product categories** from the `Product` table.

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
- `DISTINCT` ensures that duplicate category values are removed.  
- This query returns a list of unique product categories.

## ✅ SQL Solution  
```sql
SELECT DISTINCT Category FROM Product;
