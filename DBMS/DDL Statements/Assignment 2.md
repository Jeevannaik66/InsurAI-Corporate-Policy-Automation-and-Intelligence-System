# 🧾 Assignment 2 – Insert Data into Article Table

## 📜 Problem Statement  
Insert the following data into the `Article` table.

| ArCode | ArName | Rate | Quantity | Class |
|--------|--------|------|----------|-------|
| A1001  | Mouse  | 500  | 0        | C     |

## 💡 Explanation  
- The query inserts a single record into the `Article` table.  
- All columns (`ArCode`, `ArName`, `Rate`, `Quantity`, `Class`) are specified explicitly in the `INSERT` statement.  
- The values match the provided data exactly.  

## ✅ SQL Solution  
```sql
INSERT INTO Article (ArCode, ArName, Rate, Quantity, Class)
VALUES ('A1001', 'Mouse', 500, 0, 'C');
