# ALTER TABLE – Rename Column

## 📝 Task Description
Rename the column `PId` to `PlayerId` in the table `Player`.

---

## 📊 Table Structure Before Alteration

| Column Name | Data Type     | Constraint     | Description             |
|-------------|---------------|----------------|-------------------------|
| PId         | INTEGER       | PRIMARY KEY    | Unique Player Id        |
| PName       | VARCHAR2(20)  | NOT NULL       | Player Name             |
| Ranking     | INTEGER       | —              | Player's ranking        |
| ContactNo   | NUMBER(10)    | —              | Player Contact Number   |

---

## ✅ SQL Query
```sql
ALTER TABLE Player
RENAME COLUMN PId TO PlayerId;
