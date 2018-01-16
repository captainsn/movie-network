cd "C:\Program Files\MongoDB\Server\3.6\bin"
START mongod --dbpath "C:\mongod\movie-network\data\db" --port 5000
TIMEOUT 1
cd "C:\Users\Sam\Documents\App Dev BootCamp\movie-network\backend"
nodemon api.js

rem format:

rem cd "folder containing mondo.exe"
rem START mongod --dbpath "db folder" --port 5000
rem TIMEOUT 1
rem cd "file containing app.js"
rem node app.js
