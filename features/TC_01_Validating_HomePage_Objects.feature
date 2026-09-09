@all
@TC01
Feature: Gobibo - Validate Header Menu Links in HomaPage
    Check that all header menu links work and lead to the correct pages.

Scenario: Validate individual header menu links in 
     Given Launching Application
    Then Validate Home Page
    When I click on the "{menu_item}" menu link it Should be redirected to respective page

        | menu_item  | expected_url                  | expected_title             |
        | Flights    | /flights                      | Flights Booking            |
        | Hotels     | /hotels                       | Hotel Booking              |
        | Trains     | /trains                       | Train Tickets              |
        | Cabs       | /cars                         | Cab Booking                |
        | Bus        | /bus                          | Bus Ticket                 |                            
        | Insurance  | /insurance                    | Insurance                  |
    Then I close the application  
@Smoke

Scenario: Validating Fields in the Flights Booking Page     
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
   Then I select the "One-way" radio button
  Then I search for flights with the following details  
  
    | From_City       | To_City         | Departure_Date | Return_Date | Passengers |
    | Chennai         | New York     | 2023-10-01     |             | 1          |
   
    Then I should see the search results for Flights for the specified route

   | From_City       | To_City         |
   | Chennai         | New York        |
   Then I close the application