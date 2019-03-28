//USEUNIT CommonApplication
//USEUNIT CommonReporting
//USEUNIT CommonData
//USEUNIT Customers
//USEUNIT CustomersData
//USEUNIT MenuBar

function ST02_CreateTwoNewCustomers_UsingDictionaries()
{
  Log_InitTestCase("ST02_CreateTwoNewCustomers_UsingDictionaries", "Create two new customers using dictionaries");
  Log_CurrentStep("Step 1: Select new Customers tab and click on Create New Button");
  CommonApplication_StartApplication(10000);
  MenuBar_SelectCustomersTab();
  Customers_ClickButtonNew();
  
  Log_CurrentStep("Step 2: Create new customer using xml dictionary data");
  CustomersData_UpdateDictionaryFromXML("ST02_CreateTwoNewCustomers_UsingDictionaries", "FirstCustomer")
  Customers_FillCustomerName(CustomersData_GetParameter("Name"));
  Customers_FillCustomerSurname(CustomersData_GetParameter("Surname"));
  Customers_FillCustomerPhoneNumber(CustomersData_GetParameter("Phone"));
  Customers_FillCustomerEmail(CustomersData_GetParameter("Email"));
  Customers_FillCustomerCity(CustomersData_GetParameter("City"));
  Customers_FillCustomerStreet(CustomersData_GetParameter("Street"));
  Customers_ClickButtonSave();
  
  Log_CurrentStep("Step 3: Create another customer using dictionaries");
  CustomersData_UpdateDictionaryFromXML("ST02_CreateTwoNewCustomers_UsingDictionaries", "SecondCustomer");
  Customers_ClickButtonNew();
  Customers_FillCustomerName(CustomersData_GetParameter("Name"));
  Customers_FillCustomerSurname(CustomersData_GetParameter("Surname"));
  Customers_FillCustomerPhoneNumber(CustomersData_GetParameter("Phone"));
  Customers_FillCustomerEmail(CustomersData_GetParameter("Email"));
  Customers_FillCustomerCity(CustomersData_GetParameter("City"));
  Customers_FillCustomerStreet(CustomersData_GetParameter("Street"));
  Customers_ClickButtonSave();
  
  Log_CurrentStep("Step 4: Close the application and store results");
  CommonReporting.Log_CurrentTestCaseStatusPass();
}