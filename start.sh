#!/bin/sh
#echo "Sleeping!"
#sleep infinity
#cd reactapp
#echo "Starting reactapp"
#npm run dev &
cd webapi
echo "Starting webapi"
dotnet webapi.dll --urls http://webapi:7281
echo "start.sh exited"