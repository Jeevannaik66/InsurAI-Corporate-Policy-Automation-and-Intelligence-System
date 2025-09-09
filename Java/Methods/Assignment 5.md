# Assignment 5 – Constructors  

This assignment focuses on modifying the `Order` class to include constructors and demonstrate their usage. It is part of the Infosys Springboard course on Java – Constructors and `this` keyword.

## 📝 Problem Statement  
Update the `Order` class in the **SwiftFood** project to include:  
- A **default constructor** that sets `status` to `"Ordered"`  
- A **parameterized constructor** that initializes `orderId` and `orderedFoods`, and sets `status` to `"Ordered"`  
- A tester class to create objects using both constructors and display the values of instance variables  

## 🧩 Class Specification  

| Variable Name   | Data Type | Description                  |
|------------------|-----------|------------------------------|
| `orderId`        | `int`     | Unique ID of the order       |
| `orderedFoods`   | `String`  | Name of the food item        |
| `status`         | `String`  | Current status of the order  |

## 🔹 Constructors  

```java
Order()
````

Sets `status` to `"Ordered"`.

```java
Order(int orderId, String orderedFoods)
```

Initializes `orderId` and `orderedFoods`, sets `status` to `"Ordered"`.

## 💻 Java Code

```java
// Order.java
public class Order {
    int orderId;
    String orderedFoods;
    String status;

    Order() {
        status = "Ordered";
    }
    Order(int orderId, String orderedFoods) {
        this.orderId = orderId;
        this.orderedFoods = orderedFoods;
        status = "Ordered";
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Order order1 = new Order();
        System.out.println("Status: " + order1.status);

        Order order2 = new Order(1001, "Paneer Wrap");
        System.out.println("Order ID: " + order2.orderId);
        System.out.println("Ordered Food: " + order2.orderedFoods);
        System.out.println("Status: " + order2.status);
    }
}
```

## 📊 Expected Output

```
Status: Ordered
Order ID: 1001
Ordered Food: Paneer Wrap
Status: Ordered
```

```
