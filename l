./m

sudo rm -rf /Library/WebServer/Documents/*
sudo cp -r ../../build/plexode/public_html/* /Library/WebServer/Documents

sudo rm -rf /Library/WebServer/CGI-Executables/*
sudo cp -r ../../build/plexode/cgi-bin/* /Library/WebServer/CGI-Executables
sudo chmod ugo+x /Library/WebServer/CGI-Executables/*