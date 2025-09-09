# 🏟️ Tournament Table – Sports Craft Knockout Events

## 📜 Problem Statement  
Sports Craft Company organizes tournaments in multiple individual sports, featuring top-ranked players. Each tournament follows a knockout format and awards a prize.

Create the `Tournament` table using the specifications provided.

## 🧩 Table Structure

| Column Name | Data Type     | Constraints    | Description                                 |
|-------------|---------------|----------------|---------------------------------------------|
| `TId`       | `INTEGER`     | `PRIMARY KEY`  | Unique tournament ID                        |
| `TName`     | `VARCHAR2(30)`| `NOT NULL`     | Name of the tournament                      |
| `StartDt`   | `DATE`        | `NOT NULL`     | Start date of the tournament                |
| `EndDt`     | `DATE`        | `NOT NULL`     | End date of the tournament                  |
| `Prize`     | `INTEGER`     | `NOT NULL`     | Prize to be awarded                         |

## 💡 Explanation  
- Each tournament must have a unique identifier (`TId`).  
- `TName` is required and must support up to 30 characters.  
- Tournament duration is captured with `StartDt` and `EndDt`.  
- Prize money is stored as an integer and cannot be null.

## ✅ SQL Solution  
```sql
CREATE TABLE Tournament (
    TId INTEGER PRIMARY KEY,
    TName VARCHAR2(30) NOT NULL,
    StartDt DATE NOT NULL,
    EndDt DATE NOT NULL,
    Prize INTEGER NOT NULL
);
