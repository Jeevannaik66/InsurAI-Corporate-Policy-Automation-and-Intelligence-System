# 🧾 Salesman Table – Product Sales System

## 📜 Problem Statement  
The Salesman table is used to track individuals responsible for selling products across various cities. Your task is to **insert a new record** into the `Salesman` table with the following values:
- `Sid`: 11  
- `Sname`: Elizabeth  
- `Location`: London

## 🧩 Table Structure

| Column Name | Data Type | Description              |
|-------------|-----------|--------------------------|
| `Sid`       | `INT`     | Unique Salesman ID       |
| `Sname`     | `VARCHAR` | Salesman Name            |
| `Location`  | `VARCHAR` | City where they operate  |

## 💡 Explanation  
- Each salesman is identified by a unique `Sid`.  
- `Sname` stores the name of the salesman.  
- `Location` indicates the city they are assigned to.  
- This insert helps populate the table for future sales tracking.

## ✅ SQL Solution  
```sql
INSERT INTO salesman VALUES(11, 'Elizabeth', 'London');
