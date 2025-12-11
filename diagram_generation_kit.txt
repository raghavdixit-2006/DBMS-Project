SECTION 1: DATA DICTIONARY (SHOE STORE CONTEXT)

1. ENTITIES
*   **Users**: Represents the customers of the website.
*   **Products**: Represents the shoes available for sale.
*   **Orders**: Represents a purchase transaction.
*   **Order_Items**: Represents the specific shoes within an order (Associative Entity).
*   **Payments**: Represents the transaction payment details.

2. ATTRIBUTES
*   **Users**
    *   `User_ID` (PK)
    *   `Name`
    *   `Email`
    *   `Password`
    *   `Address`

*   **Products**
    *   `Product_ID` (PK)
    *   `Name`
    *   `Size`
    *   `Color`
    *   `Price`
    *   `Stock`
    *   `Category`

*   **Orders**
    *   `Order_ID` (PK)
    *   `User_ID` (FK)
    *   `Date`
    *   `Total_Amount`

*   **Order_Items**
    *   `ID` (PK)
    *   `Order_ID` (FK)
    *   `Product_ID` (FK)
    *   `Quantity`

*   **Payments**
    *   `Payment_ID` (PK)
    *   `Order_ID` (FK)
    *   `Amount`
    *   `Payment_Method`
    *   `Status`

3. RELATIONSHIPS
*   **Places**: User --(1:N)--> Order
*   **Contains**: Order --(M:N)--> Products (Realized via Order_Items)
*   **Generates**: Order --(1:1)--> Payment

------------------------------------------------------------------------------------------------
SECTION 2: THE VISUAL GENERATION PROMPT (STRICT CHEN'S NOTATION)

*** COPY BELOW THIS LINE ***

I need to generate a specific "Conceptual ER Diagram" for a Shoe Website that follows "Chen's Notation" (bubbles and diamonds).

Please generate **Mermaid.js FLOWCHART code** (`graph TD`) to visualize this.
Do NOT use the standard `erDiagram` syntax, as it does not support the specific shapes required for Chen's notation (Diamonds and Ovals).

**Instructions for Mermaid Syntax:**
1.  **ENTITIES** (Rectangles): Use `EntityName[EntityName]`
2.  **ATTRIBUTES** (Ovals): Use `AttributeName((AttributeName))`
    *   Connect Attributes to their Entity with a simple line `---`
3.  **RELATIONSHIPS** (Diamonds): Use `RelName{RelationshipName}`
    *   Connect Entities to Relationships with lines `---`
4.  **CARDINALITY**: Add text labels on the connecting lines (e.g., `|1|` or `|N|`).

**Diagram Content to Visualize:**

**Entities & Attributes:**
*   `Users`: User_ID((User_ID)), Name((Name)), Email((Email)), Password((Password)), Address((Address))
*   `Products`: Product_ID((Product_ID)), Name((Name)), Size((Size)), Color((Color)), Price((Price)), Stock((Stock)), Category((Category))
*   `Orders`: Order_ID((Order_ID)), Date((Date)), Total_Amount((Total_Amount))
*   `Payments`: Payment_ID((Payment_ID)), Amount((Amount)), Status((Status))

**Relationships:**
1.  **Places**: Connect `Users` to `Orders` via a Diamond `{Places}`.
    *   Cardinality: User (1) -- Places -- (N) Order.
2.  **Contains**: Connect `Orders` to `Products` via a Diamond `{Contains}`.
    *   Cardinality: Order (N) -- Contains -- (M) Products.
    *   *Note*: The `Order_Items` entity from the schema is conceptually this M:N relationship. Attach attributes `Quantity` and `ID` directly to this `{Contains}` diamond if possible, or represent it as an associative node.
3.  **Generates**: Connect `Orders` to `Payments` via a Diamond `{Generates}`.
    *   Cardinality: Order (1) -- Generates -- (1) Payment.

**Output:**
Provide only the valid Mermaid `graph TD` code block.
