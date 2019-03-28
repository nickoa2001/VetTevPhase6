﻿//USEUNIT CommonReporting
//USEUNIT CommonData
//USEUNIT Animals
//USEUNIT AnimalsData
//USEUNIT Customers
//USEUNIT CustomersData
//USEUNIT CommonApplication
//USEUNIT MenuBar

function ST03_CreateNewAnimalEntry()
{
  Log_InitTestCase("ST03_CreateNewAnimalEntry", "Create a new Animal entry");
  Log_CurrentStep("Step 1: Start application and select Animals tab");
  CommonApplication_StopProcess();
  CommonApplication_StartApplication(10000);
  MenuBar_SelectAnimalsTab();
  
  Log_CurrentStep("Step 2: Search for the custonmer name ");
  AnimalsData_UpdateDictionaryFromXML("ST03_CreateNewAnimalEntry", "AddAnimalEntry")
  Animals_SeachCustomerName(AnimalsData_GetParameter("OwnerName"));
  //Animals_FindCustomerName(AnimalsData_GetParameter("OwnerName"));
  
  Log_CurrentStep("Step 3: Click New button and fill in the Animal details");
  Animals_ClickButtonNew();
  Log_CurrentStep("Step 3.1: Insert animal breed");
  //let animalRandomName = Math.floor((Math.random() * 1000) + 1);
  //Animals_FillBreed("*Labrador*");
  Animals_FillBreed(AnimalsData_GetParameter("Breed"));
  
  Log_CurrentStep("Step 3.2: Insert animal sex");
  Animals_SelectSex("M");
  Animals_SelectSex("F");
  Animals_SelectSex("m");
  Animals_SelectSex();
  Animals_SelectSex(AnimalsData_GetParameter("Sex"));
  
  Log_CurrentStep("Step 3.3: Insert the rest of animal details");
  Animals_FillBreed(AnimalsData_GetParameter("Breed"));
  Animals_FillAnimalName(AnimalsData_GetParameter("AnimalName"));
  Animals_ClickButtonSave();
  
  Log_CurrentStep("Step 4: Close the application and store results");
  CommonReporting.Log_CurrentTestCaseStatusPass();
}