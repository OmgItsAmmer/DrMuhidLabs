architecture

login with google OAuth (db has role column with "customer" or "admin")

detects client or admin

if client 

show dashboard with video cards 

clicking video cards open product screen

multiple images, thumbnail video,reviews,uploaded by,buy lecture button

buy lecture button redirects to next screen asking for upload payment proof (transactionId)

it will go into verifying phase. and sends to Admin dashboard Admin press grant access and user grants access to the video 

video is on youtube 

imp: Client and Admin both are in same project

Admin Side:

once user logins with google account 
backend checks the role of that account if it admins it shows admin dashboard side.
admin has three tabs , manage course , verify payment , manage customers

manage course has video tiles clicking on them can update each thing in that course
also it has add course button which add new course to db 

verify payments show all the list of tiles showing the transaction id , customer name , course name , and grant access button

manage customers shows tiles of customer with search feature , clicking each tile shows customer info and show all his bought courses

