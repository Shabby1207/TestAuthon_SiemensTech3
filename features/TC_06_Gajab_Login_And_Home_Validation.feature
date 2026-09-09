@all
@E2E
Feature: Gajab - End to End Purchase and Bargain Journey
  As a user
  I want to complete the full Gajab flow from login to order confirmation
  So that core shopping, bargaining, payment, and savings validation are covered

  @TC06
  @Smoke
  Scenario: Complete Gajab end to end flow with fallback handling
    Given I launch Gajab application sign-in page
    When I enter mobile number in sign-in form
    Then I accept age confirmation and terms in sign-in form
    Then I should see sign-in terms selected
    Then I explore deal of the day and trending products
    Then I browse widget and toys listing flow
    Then I perform bargain checkout and payment flow
    Then I verify order confirmation and revisit bargain product

  @Documentation
  @ignore
  Scenario: Complete Gajab end to end flow with full business statements
    Given I navigate to gajab website
    When I click on log in or sign-up button
    And I enter mobile number and request otp
    And I enter default otp "123456" and submit
    Then I should see login success message
    When I enter pincode and select location
    Then selected pincode should be reflected on home page
    And I capture gajab deal of the day details
    And I email deal product image name and asking price to configured email
    When I identify most bargained product under trending products
    Then if bargain count ties I should pick first product in scroll order
    When I verify latest live order card
    Then I fetch latest live order name and city
    And I capture screenshot of latest live order details
    When I open just bargained product section using view all
    Then I identify cheapest product among most bargained list
    When I open toys and games category tab
    And I select brand "SERA'S BASKET" from left filter
    And I set product price range from "427" to "727"
    And I open product "Classic 15.7 Inch Soft Tip Dartboard Game Set"
    And I start bargaining on selected product
    And I continue bargaining for 3 attempts
    And I accept offered bargain price
    And I click buy now
    And I select payment method "Pay Online" and proceed to pay
    And I choose net banking and select any available bank
    And I confirm payment success
    Then I should verify order placed successfully
    When I open my bargains section
    Then I should verify savings for placed order
    And if any specified product price filter brand or dependency is unavailable I document issue with evidence
    And I apply a reasonable fallback approach and continue validation
