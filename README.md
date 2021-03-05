# Inventory Service
Service to manage stock

## How to run

- git clone this repo
- npm i
- run `npm run start` to start the server
- go to http://localhost:8000/playground
- Query stock:
  ```
  query {
    itemQuantity
  }
  ```
- return item:
  ```
  mutation {
    itemReturn(serialNumber: "some-serials") {
      item {
        serialNumber
      }
      userErrors {
        ... on DuplicateSerialNumberError {
          message
        }
      }
    }
  }
  ```
  
- retrieve item:
    ```
    mutation {
      itemRetrieve(quantity: 2){
        serialNumbers
        userErrors {
          __typename 
          ... on RetrieveQuantityError {
            message
          }
          
          ... on LowStockError {
            message
          }
        }
      }
    }
    ```
    
Note: please make sure a local mongo is running.
  
  
