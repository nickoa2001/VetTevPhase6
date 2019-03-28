//USEUNIT CommonObjects
var applicationPath = "d:\\Work\\WorkShop\\VetTev\\";

function CommonApplication_StartApplication(timeout)
{
  timeout = timeout || 60000;
  if (CommonApplication_CheckProcessRunning(processName))
  {
    Log.Message("[CommonApplication_StartApplication] Stopping previous running instances of"+ processName);
    CommonApplication_StopProcess();
  }
  
  Log.Message("[CommonApplication_StartApplication] Starting the application: "+ processName);
  var wshell = Sys.OleObject("WScript.Shell");
  //let expandedApplicationPath = Project.Path+ "..\\" + applicationPath ;
  
  wshell.CurrentDirectory = applicationPath;
  wshell.Exec(CommonObjects.processName);
  Sys.WaitProcess("vettev.exe");  
}

function CommonApplication_StopProcess()
{
  if (Sys.WaitProcess(processName).Exists)
  {
    Log.Message("Closing the application");
    Sys.Process(processName).Terminate();
  }
}

function CommonApplication_CheckProcessRunning(processName)
{
  Log.Message(`[CommonApplication_CheckProcessRunning] Test if process ${processName} is running`);
  return Sys.WaitProcess(processName).Exists;
}