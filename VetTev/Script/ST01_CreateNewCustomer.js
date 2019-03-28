﻿//USEUNIT CommonReporting
//USEUNIT CommonData
//USEUNIT Customers
//USEUNIT CustomersData
//USEUNIT CommonApplication
//USEUNIT MenuBar

function ST01_CreateNewCustomer()
{
  Log_InitTestCase("ST01_CreateNewCustomer", "Create a new Customer");
  Log_CurrentStep("Step 1: Start application, select Customers tab and click on Button New");
  CommonApplication_StartApplication(10000);
  MenuBar_SelectCustomersTab();
  Customers_ClickButtonNew();
  
  Log_CurrentStep("Step 2: Create a new customer by filling in all the details");
  let customerRandomName = Math.floor((Math.random() * 1000) + 1);
  Customers_FillCustomerName(`Agent${customerRandomName}`);
  Customers_FillCustomerSurname(`Bond${customerRandomName}`);
  Customers_FillCustomerEmail(`agent.bond${customerRandomName}@gmail.com`);
  Customers_FillCustomerCity(`Cluj-Napoca`);
  Customers_FillCustomerStreet(`Republicii`);
  Customers_ClickButtonSave();
  
  Log_CurrentStep("Step 3: Delete last created customer entry");
  Customers_DeleteLastEntry();

  Log_CurrentStep("Step 4: Close the application and store results");
  CommonReporting.Log_CurrentTestCaseStatusPass();
}