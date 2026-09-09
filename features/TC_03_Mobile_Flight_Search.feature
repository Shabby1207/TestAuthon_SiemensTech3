@all
@mobile
@TC03
@TCM01
Feature: Mobile Flight Page - Validate Flight Search Functionality
  As a mobile web user
  I want to validate the flight search flow on Goibibo
  So that I can confirm key booking interactions work on mobile layout

  @Smoke
  Scenario: Search for Flights on mobile with One-way option
    Given Launching Application
    Then Validate Home Page
    When I click on the "{menu_item}" menu link it Should be redirected to respective page
      | menu_item | expected_url | expected_title  |
      | Flights   | /flights     | Flights Booking |
    Then I should see the following radio buttons on the Flights Booking page and they should be clickable
      | field_name |
      | One-way    |
    Then I select the "One-way" radio button
    Then I search for flights with the following details
      | From_City | To_City | Departure_Date | Return_Date | Passengers |
      | Chennai   | Mumbai  | 2026-12-20     |             | 1          |
    Then I should see the search results for Flights for the specified route
      | From_City | To_City |
      | Chennai   | Mumbai  |
    Then I close the application
