# Projektarbeit

Step for Step Guide to run the project local by using Intellij:

Step 1: Install Google Chrome

	1. Navigate to: https://www.google.com/chrome/?brand=YTUH&gclid=EAIaIQobChMI143x9tvu-QIVtIBQBh38fABzEAAYASAAEgI_qfD_BwE&gclsrc=aw.ds
  
	2. Press Download Chrome and follow instructions

Step 2: Install Node/Npm

	1. Navigate to: https://nodejs.org/en/download/
  
	2. Download the executable or package depending on your operating system

Step 3: Download the Java OpenJdk 15.0.2

	1. Navigate to: https://jdk.java.net/archive/
  
	2. Scroll down to Version: 15.0.2 (build 15.0.2+9) (any Version of 15 will work)
	
Step 4: Unzip the OpenJDK

	1. Unzip the downloaded OpenJdk
  
	2. For Windows the default location for the unzipped Jdk is C:/Users/.jdks
		
Step 5: Install Intellij

	1. Navigate to: https://www.jetbrains.com/de-de/idea/download/#section=windows
  
	2. Persons with a studmail email can create an account to receive the Ultimate version 
     (Recommended) for free, but the community-version also works 
  
	3. Download the ide and follow instructions

Step 6.a Get the Project (Without Git)

	1. Navigate to https://github.com/SimonRuttmann/Projektarbeit			
  
	2. Press on "Code" Button		
  
	3. Download ZIP					

Step 7.a Start the backend application (Without Git)

	1. Open Intellij and select "Open existing Project"
  
	2. Select the unzipped project
  
	3. A hint "Maven Build Script Found" Popup will appear -> Select "Load Buil"
		This will take serveral minues as all maven dependencies will be installed
    
	4. Navigate to ServerApplication.java 
		A hint will become visible showing "Project JDK is not defined"
		Select to "Setup SDK" -> "Add JDK" -> Select unzipped downloaded OpenJdk folder
    
	5. Run the application, verify no errors occur
	
Step 8.	Start the frontend application

	1. Restart the ide
  
	2. Verify node is installed with the command "node-v" in the integrated terminal
  
	3. CD to frontend/reactapp
  
	4. Type in command terminal: "npm install"
		This will take serveral seconds, as all dependecies (defined in the packages.json) will be installed
    
	5. Run the command in termianl: "npm start" and the development server should start, after some seconds 
	    the browser should start and show the application, if not start a browser and navigate to localhost:3000
      
	6. To close the front end server type into the running terminal "STRG + C"

Step 9. Validate the programm is running correctly

	1. Start the backend application if not already running
  
	2. Start the frontend application if not alreay running
  
	3. Open browser and navigate to "localhost:3000"
  
	4. Create an entity and an identifying attribute, connect them to each other and click the transform button
  
	5. The view should change to the raltional diagram

	6. If it did not change right-click on the bowser and select "inspect" if an red error is occuring in the 
     left side saying "ERR_SSL_CON_REFUSED" this is due to local settings 
  
	   The easiest way this can be bypassed is by navigating to the .env file in the frontend/reactapp folder and changing the line 3
		REACT_APP_BACKEND_BASEURL_DEVELOPMENT = "https://localhost:8080"
		to:
		REACT_APP_BACKEND_BASEURL_DEVELOPMENT = "http://localhost:8080"
	   Afterwards restart the frontend application.

Step 6.b Get the Project (With Git, Recommended)

	1. Navigate to: https://git-scm.com/download/win
  
	2. Download Git and follow instructions			
  
	3. Create an Github-Account		
  
	4. Fork the project into an repository
  
	5. Navigate into your repository	
  
	6. Java OpenJdk 15.0.2
  
	7. Press on "Code" Button and Copy the HTTPS Link

Step 7.b (With Git, Recommended)

	Select "VCS" -> "Get from Version Control"
  
	Paste the URL copied in Step 6.b. 7 and select any dicectory
  
	Insert your credentials.
  
	Continue with Step 7.a. No. 3
