# Match Table Definition 

## 🎯 Objective
Create a `Match` table that captures details of individual matches played in a tournament. This table connects players and tournaments using foreign key relationships and enforces match integrity through constraints.

---

## 📐 Table Schema

| Column Name | Data Type     | Constraints            | Description                                        |
|-------------|---------------|------------------------|----------------------------------------------------|
| `MId`       | INTEGER        | PRIMARY KEY            | Unique match ID within a tournament                |
| `TId`       | INTEGER        | PRIMARY KEY, FOREIGN KEY | References `Tournament(TId)`                        |
| `Player1`   | INTEGER        | FOREIGN KEY            | References `Player(PId)` — must differ from `Player2` |
| `Player2`   | INTEGER        | FOREIGN KEY            | References `Player(PId)`                           |
| `MatchDt`   | DATE           | NOT NULL               | Date of the match                                  |
| `Winner`    | INTEGER        | FOREIGN KEY            | References `Player(PId)` — must be one of the players |
| `Score`     | VARCHAR2(30)   | NOT NULL               | Final match score                                  |

---

## 🔒 Constraints
- Composite **Primary Key**: `(MId, TId)` ensures match uniqueness within tournaments.
- **Foreign Keys**:
  - `TId → Tournament(TId)`
  - `Player1`, `Player2`, `Winner → Player(PId)`
- **Check Constraint**:
  - `Player1 <> Player2` prevents self-match.
- `MatchDt` and `Score` cannot be NULL.

---

## ✅ SQL Query

```sql
CREATE TABLE Match (
    MId INTEGER,
    TId INTEGER,
    Player1 INTEGER,
    Player2 INTEGER,
    MatchDt DATE NOT NULL,
    Winner INTEGER,
    Score VARCHAR2(30) NOT NULL,

    CONSTRAINT pk_match PRIMARY KEY (MId, TId),
    CONSTRAINT fk_tid FOREIGN KEY (TId) REFERENCES Tournament(TId),
    CONSTRAINT fk_player1 FOREIGN KEY (Player1) REFERENCES Player(PId),
    CONSTRAINT fk_player2 FOREIGN KEY (Player2) REFERENCES Player(PId),
    CONSTRAINT fk_winner FOREIGN KEY (Winner) REFERENCES Player(PId),
    CONSTRAINT chk_different_players CHECK (Player1 <> Player2)
);
