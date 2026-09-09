@all
@TC05
Feature: Gajab - Validate Login With Mobile Number
  As a user
  I want to open Gajab sign-in page and enter my mobile number
  So that I can proceed in the login flow after accepting terms
  Check for the deal of the Day and Trending Products, Browse Widget and Toys Listing Flow, Perform Bargain Checkout and Payment Flow, Verify Order Confirmation and Revisit Bargain Product  

  @Language_English
  Scenario: Validate sign-in flow with English language, mobile number and terms acceptance
    Given I launch Gajab application sign-in page
    When I select "English" language in sign-in form
    When I enter mobile number in sign-in form
    Then I accept age confirmation and terms in sign-in form
    Then I should see sign-in terms selected
    Then I explore deal of the day and trending products
    Then I browse widget and toys listing flow
    Then I perform bargain checkout and payment flow
    Then I verify order confirmation and revisit bargain product

  @Language_Hinglish
  Scenario: Validate sign-in flow with Hinglish language, mobile number and terms acceptance
    Given I launch Gajab application sign-in page
    When I select "Hinglish" language in sign-in form
    When I enter mobile number in sign-in form
    Then I accept age confirmation and terms in sign-in form
    Then I should see sign-in terms selected
    Then I explore deal of the day and trending products
    Then I browse widget and toys listing flow
    Then I perform bargain checkout and payment flow
    Then I verify order confirmation and revisit bargain product
