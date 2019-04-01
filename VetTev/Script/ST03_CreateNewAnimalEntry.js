//USEUNIT CommonReporting
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
  
  Log_CurrentStep("Step 3.1: Insert animal name");
  //let animalRandomName = Math.floor((Math.random() * 1000) + 1);
  //Animals_FillAnimalName(animalRandomName)
  Animals_FillAnimalName(AnimalsData_GetParameter("AnimalName"));
  
  Log_CurrentStep("Step 3.2: Select animal gender");
  Animals_SelectGender("M");
  Animals_SelectGender("F");
  Animals_SelectGender("m");
  Animals_SelectGender();
  Animals_SelectGender(AnimalsData_GetParameter("Gender"));
  
  Log_CurrentStep("Step 3.3: Fill animal breed");
  //Animals_FillBreed("*Labrador*");
  Animals_FillBreed(AnimalsData_GetParameter("Breed"));
    
  Log_CurrentStep("Step 3.4: Detail first that animal is not sterlized");
  Animals_IsAnimalSterilized(AnimalsData_GetParameter("Sterilized"));
  Animals_AddNotes(AnimalsData_GetParameter("Note"));
  
  Log_CurrentStep("Step 4: Mark the animal as sterilized and add a note about this");
  AnimalsData_UpdateDictionaryFromXML("ST03_CreateNewAnimalEntry", "ChangeAnimalData")
  Animals_IsAnimalSterilized(AnimalsData_GetParameter("Sterilized"));
  Animals_AddNotes(AnimalsData_GetParameter("Note"));
  
  Log_CurrentStep("Step 5: Save last added animal details");
  Animals_ClickButtonSave();
  
  Log_CurrentStep("Step 6: Close the application and store results");
  CommonReporting.Log_CurrentTestCaseStatusPass();
}