# SECTION 1: The Data Dictionary

This data dictionary is derived from the project's SQL schema and application logic.

### Entities

*   User
*   Product
*   Order
*   Exchange
*   Newsletter_Subscriber

### Attributes by Entity

*   **User**
    *   `id` (Primary Key)
    *   `name`
    *   `email`
    *   `password` (Hashed)
    *   `created_at`
*   **Product**
    *   `id` (Primary Key)
    *   `name`
    *   `price`
    *   `gender`
    *   `occasion`
    *   `img_url`
    *   `size` (Multi-valued Attribute)
*   **Order**
    *   `id` (Primary Key)
    *   `order_date`
    *   `total_amount`
*   **Exchange**
    *   `id` (Primary Key)
    *   `reason`
    *   `status`
    *   `requested_at`
*   **Newsletter_Subscriber**
    *   `id` (Primary Key)
    *   `email`
    *   `subscribed_at`

### Relationships

*   **Places (between User and Order)**
    *   Cardinality: One-to-Many
    *   Description: One `User` can place many `Orders`.
*   **Contains (between Order and Product)**
    *   Cardinality: Many-to-Many
    *   Description: One `Order` can contain many `Products`, and one `Product` can be in many `Orders`.
    *   Relationship Attributes: `quantity`, `price_at_purchase`, `size`.
*   **Requests (between Order and Exchange)**
    *   Cardinality: One-to-Many
    *   Description: One `Order` can have many `Exchange` requests.

---

# SECTION 2: THE GEMINI WEB PROMPT (Copy & Paste this)

I need you to generate an image (or SVG code) of a Chen Notation ER Diagram for a Shoe Store database. 
Here are the specific details to include:

ENTITIES & ATTRIBUTES:
*   User: `id` (underlined), `name`, `email`, `password`, `created_at`
*   Product: `id` (underlined), `name`, `price`, `gender`, `occasion`, `img_url`, and a double-oval for `size`
*   Order: `id` (underlined), `order_date`, `total_amount`
*   Exchange: `id` (underlined), `reason`, `status`, `requested_at`
*   Newsletter_Subscriber: `id` (underlined), `email`, `subscribed_at`

RELATIONSHIPS:
1.  A diamond named "Places" connecting `User` and `Order`. Show "1" on the `User` side and "N" on the `Order` side.
2.  A diamond named "Contains" connecting `Order` and `Product`. Show "N" on the `Order` side and "M" on the `Product` side. This "Contains" diamond should have its own attributes connected to it: `quantity`, `price_at_purchase`, and `size`.
3.  A diamond named "Requests" connecting `Order` and `Exchange`. Show "1" on the `Order` side and "N" on the `Exchange` side.

VISUAL STYLE INSTRUCTION:
- Use Rectangles for Entities.
- Use Ovals for Attributes connected to entities. Underline the primary key attributes. Use a double-oval for the multi-valued attribute `size`.
- Use Diamonds for Relationships.
- Please generate this as a clean visual representation.
