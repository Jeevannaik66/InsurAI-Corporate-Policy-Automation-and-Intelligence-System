# Assignment 4  

This assignment focuses on implementing a Java class `Rectangle` with methods to calculate area and perimeter. It is part of the Infosys Springboard course on Java – Methods.

## 📝 Problem Statement  
Create a class `Rectangle` in the **SwiftFood** project with:  
- Instance variables to store length and breadth  
- A method `calculateArea()` to compute and return the area  
- A method `calculatePerimeter()` to compute and return the perimeter  
- A tester class to assign values, invoke both methods, and display the results  

## 🧩 Class Specification  

| Variable Name | Data Type | Description               |
|---------------|-----------|---------------------------|
| `length`      | `double`  | Length of the rectangle   |
| `breadth`     | `double`  | Breadth of the rectangle  |

## 🔹 Methods  

```java
double calculateArea()
````

Returns the area of the rectangle, rounded to two decimal places.

```java
double calculatePerimeter()
```

Returns the perimeter of the rectangle, rounded to two decimal places.

## 💻 Java Code

```java
// Rectangle.java
public class Rectangle {
    double length;
    double breadth;

    double calculateArea() {
        return Math.round(length * breadth * 100.0) / 100.0;
    }
    double calculatePerimeter() {
        return Math.round(2 * (length + breadth) * 100.0) / 100.0;
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Rectangle rectangle = new Rectangle();
        rectangle.length = 5.75;
        rectangle.breadth = 3.25;

        double area = rectangle.calculateArea();
        double perimeter = rectangle.calculatePerimeter();

        System.out.println("Area of the rectangle is " + area);
        System.out.println("Perimeter of the rectangle is " + perimeter);
    }
}
```

## 📊 Expected Output

```
Area of the rectangle is 18.69
Perimeter of the rectangle is 18.0
```

