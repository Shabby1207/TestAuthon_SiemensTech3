@all
@TC02
Feature: Flight Page - Validating Flight Search Functionality

  As a user
  I want to validate the search functionality on the Flights Booking page
  So that I can ensure users can search for flights with correct details and see accurate results
Scenario: Flight Booking Search Functionality
        
    Given Launching Application
    Then Validate Home Page
    When I click on the "{menu_item}" menu link it Should be redirected to respective page

        | menu_item  | expected_url | expected_title   |
        | Flights    | /flights     | Flights Booking  |
        
    Then I should see the following radio buttons on the Flights Booking page and they should be clickable
   
    | field_name          |
    | One-way             |
    | Round-trip          |
    | Multi-city          |
      Then I close the application  
 @Smoke    
Scenario: Search for Flights with One-way Option
      Given Launching Application
    Then Validate Home Page
   Then I select the "One-way" radio button
    When I click on the "{menu_item}" menu link it Should be redirected to respective page

        | menu_item  | expected_url | expected_title   |
        | Flights    | /flights     | Flights Booking  |
  Then I search for flights with the following details  
  
    | From_City       | To_City         | Departure_Date | Return_Date | Passengers |
    | New York        | Los Angeles     | 2023-10-01     |             | 1          |
   
  Then I should see the search results for Flights for the specified route

   | From_City       | To_City         |
   | New York        | Los Angeles     |
  Then I close the application  


