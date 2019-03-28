//USEUNIT CommonObjects
//USEUNIT CommonReporting
//USEUNIT CommonTextControl

function Customers_ClickButtonNew()
{
  let buttonNew = Objects.Customers_Button_New; 
  let buttonUndo = Objects.Customers_Button_Undo;
  
  if (Customers_GetButtonEnabledProperty(buttonUndo))
    CommonObjects.CommonObjects_ButtonClick(buttonUndo);
    
  if (Customers_GetButtonEnabledProperty(buttonNew))
  {
    CommonObjects.CommonObjects_ButtonClick(buttonNew);
    return true; 
  }
  else 
    CommonReporting.Log_StepError("We cannot click on the New Button");    
}

function Customers_ClickButtonEdit()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_Edit);
}

function Customers_ClickButtonDelete()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_Delete);
}

function Customers_ClickButtonMakeInvoice()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_MakeInvoiceText);
}

function Customers_ClickButtonSave()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_Save);
}

function Customers_ClickButtonUndo()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_Undo);
}

function Customers_CheckButtonNewEnabled()
{
  if (Customers_GetButtonEnabledProperty(Objects.Customers_Button_New))
  {
    Log.Message("Button New is enabled inside Customers form");
    return true;
  }
  CommonReporting.Log_StepError("Button New is disabled inside Customers form");
}

function Customers_ClickButtonConfirmDeleteYes()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_ConfirmDeleteYes);  
}

function Customers_ClickButtonConfirmDeleteNo()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Customers_Button_ConfirmDeleteNo);  
}

function Customers_GetButtonEnabledProperty(buttonObject)
{
  let customerButton = CommonObjects.CommonObjects_FindObjectByFullName(buttonObject);
  //return aqObject.CheckProperty(customerButtonNew, "Enabled", cmpEqual, "true", false);
  return customerButton.Enabled;  
}

function Customers_FillCustomerName(customerName)
{
  customerName = customerName || "noName";
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_Name, customerName);
}

function Customers_FillCustomerSurname(customerSurname)
{
  customerSurname = customerSurname || "noSurName";
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_Surname, customerSurname);
}

function Customers_FillCustomerPhoneNumber(customerPhoneNumber)
{
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_Phone, customerPhoneNumber);
}

function Customers_FillCustomerEmail(customerEmail)
{
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_Email, customerEmail);
}

function Customers_FillCustomerCity(customerCity)
{
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_City, customerCity);
}

function Customers_FillCustomerStreet(customerStreet)
{
  CommonTextControl.TextBox_Type(Objects.Customers_TextBox_Street, customerStreet);
}

function CustomersGrid_ReturnRowCount(gridObject)
{
  let customersGridObject = gridObject || Customers_GetGridObject();
  return customersGridObject.wRowCount;
}

function CustomersGrid_CheckRowCount(gridObject, expectedRowCount)
{
  let customersGridObject = gridObject || Customers_GetGridObject();
  if (customersGridObject.wRowCount != expectedRowCount)
    Log_StepWarningContinueExecution(`Number of entries in the grid ${customersGridObject.wRowCount} does not match the expected row count: ${expectedRowCount}`);
  else
    Log.Message(`Number of entries in the grid ${customersGridObject.wRowCount} matches the expected row count`);
}

function Customers_DeleteLastEntry(gridObject)
{
  let customersGridObject = gridObject || Customers_GetGridObject();
  let lastEntry = CustomersGrid_ReturnRowCount(customersGridObject);
  customersGridObject.ClickColumnHeader("Name"); //sort by name ascending
  customersGridObject.ClickColumnHeader("Id"); //sort by Id ascending
  customersGridObject.ClickCell(lastEntry - 1, "Id");
  Customers_ClickButtonDelete();
  //Customers_CheckConfirmationDeleteMessage();
  Customers_ConfirmDelete(true);
  CustomersGrid_CheckRowCount(customersGridObject, lastEntry - 1);
}

function Customers_ConfirmDelete(confirmDelete)
{
  if (confirmDelete)
    Customers_ClickButtonConfirmDeleteYes();
  else
    Customers_ClickButtonConfirmDeleteNo();
}

function Customers_GetGridObject()
{
  return CommonObjects.CommonObjects_FindObjectByFullName(Objects.Customers_GridView)
}