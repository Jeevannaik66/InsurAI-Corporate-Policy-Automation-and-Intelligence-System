# Assignment 3

This assignment focuses on retrieving the **description** and **price** of all items that are different sizes of 'Hard disk' from the `Item` table. It is part of the Infosys Springboard course on RDBMS.

## 📝 Table Specification

| Column Name    | Data Type     | Description                                              |
|----------------|---------------|----------------------------------------------------------|
| `Itemcode`     | `INTEGER`     | Unique identifier for the item.                          |
| `Itemtype`     | `VARCHAR`     | Type of the item (e.g., Hard disk, Monitor).              |
| `Descr`        | `VARCHAR`     | Description of the item (includes size details).         |
| `Price`        | `DECIMAL`     | Price of the item.                                        |
| `Reorderlevel` | `INTEGER`     | Stock level at which reordering is triggered.             |
| `Qtyonhand`    | `INTEGER`     | Current available quantity.                               |
| `Category`     | `VARCHAR`     | Category grouping of the item.                            |

## 💡 Explanation
- The query selects `Descr` and `Price` from the `Item` table.
- It filters rows where the `Descr` contains the phrase `'Hard disk'` using `LIKE '%Hard disk%'`.
- This ensures all sizes of Hard disks (e.g., 500GB, 320GB) are included in the output.

## ✅ SQL Solution and Output
```sql
-- SQL Query
SELECT Descr, Price
FROM Item
WHERE Descr LIKE '%Hard disk%';

-- Expected Output
DESCR               | PRICE
--------------------|------
500GB Hard disk     | 2500
320GB Hard disk     | 1800
