# Assignment 1 – Methods 
This assignment focuses on creating a Java class `Order` with instance variables, a calculation method, and a tester class. It is part of the Infosys Springboard course on Java – Methods.

## 📝 Problem Statement
Create a class `Order` in the **SwiftFood** project with:
- Instance variables to store order details.
- A method `calculateTotalPrice(int unitPrice)` to compute the price including a **5% service charge**.
- A tester class to create an object, initialize data, call the method, and display results.

## 🧩 Class Specification

| Variable Name   | Data Type | Description                              |
|-----------------|-----------|------------------------------------------|
| `orderId`       | `int`     | Unique identifier for the order          |
| `orderedFoods`  | `String`  | Name of the food item ordered            |
| `totalPrice`    | `double`  | Final price after service charge         |
| `status`        | `String`  | Current status of the order              |

## 🔹 Method

```java
double calculateTotalPrice(int unitPrice)
````

* Adds a **5% service charge** to the given unit price.
* Updates the `totalPrice` variable.
* Returns the calculated total.

## 💻 Java Code

```java
// Order.java
public class Order {
    int orderId;
    String orderedFoods;
    double totalPrice;
    String status;
    double calculateTotalPrice(int unitPrice) {
        totalPrice = unitPrice * 1.05;
        return totalPrice;
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Order order = new Order();
        order.orderId = 1001;
        order.orderedFoods = "Veg Burger";
        order.status = "Confirmed";

        order.calculateTotalPrice(120);

        System.out.println("Order ID: " + order.orderId);
        System.out.println("Ordered Food: " + order.orderedFoods);
        System.out.println("Status: " + order.status);
        System.out.println("Total Price: ₹" + order.totalPrice);
    }
}
```

## 📊 Expected Output

```
Order ID: 1001
Ordered Food: Veg Burger
Status: Confirmed
Total Price: ₹126.0
```


