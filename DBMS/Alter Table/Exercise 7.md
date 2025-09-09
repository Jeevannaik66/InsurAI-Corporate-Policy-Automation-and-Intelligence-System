# 🛠️ Modify Player Name Column

## 📜 Problem Statement  
To accommodate longer player names, Sports Craft Company has decided to increase the character limit of the `PName` column. You are required to **modify the datatype of `PName`** from `VARCHAR2(20)` to `VARCHAR2(50)` in the `Player` table.

---

## 🧩 Updated Table Structure

| Column Name  | Data Type      | Constraints    | Description               |
|--------------|----------------|----------------|---------------------------|
| `PId`        | `INTEGER`      | `PRIMARY KEY`  | Unique Player Id          |
| `PName`      | `VARCHAR2(50)` | `NOT NULL`     | Player Name               |
| `Ranking`    | `INTEGER`      |                | Player's ranking          |
| `ContactNo`  | `NUMBER(10)`   |                | Player Contact Number     |

---

## 💡 Explanation  
- `VARCHAR2(50)` allows storing longer names without truncation.  
- No change to constraints — `PName` remains `NOT NULL`.  
- This update improves flexibility for future data entries.

---

## ✅ SQL Solution  
```sql
ALTER TABLE Player 
MODIFY PName VARCHAR2(50);
