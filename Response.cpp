/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Response.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/18 18:07:11 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/05 15:29:43 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Response.hpp"

Response::Response(string statusCode, SOCKET sock, Parsconfig config, string content)
{
    this->statusCode = statusCode;
    this->sock = sock;
    this->config = config;
    this->content = content;
    this->contentType = "text/html";

    setContentLength();

    send();
}

Response::Response(string statusCode, string filePath, SOCKET sock, Parsconfig config)
{
    this->statusCode = statusCode;
    this->filePath = filePath;
    this->sock = sock;
    this->config = config;

    setContent();
    setContentType();
    setContentLength();

    send();
}

Response::~Response() {}

void Response::setContent()
{
    string buffer;

    this->content = "";

    // Auto-Index
    if (this->config.getAutoIndex() && isDirectory(this->filePath.c_str()) && this->filePath[this->filePath.length() - 1] == '/')
    {
        setAutoIndex();
        return;
    }
    else if (isDirectory(this->filePath.c_str()) && this->filePath[this->filePath.length() - 1] != '/')
        this->filePath = "./index.html";


    // Read and copy the file
    ifstream myReadFile(filePath.c_str(), std::ios::binary);
    if (myReadFile.is_open())
    {
        string content((std::istreambuf_iterator<char>(myReadFile)), istreambuf_iterator<char>());
        this->content = content;
        myReadFile.close();
    }
}

void Response::setAutoIndex()
{
    DIR *dh;
    string dirPath;
    struct dirent *contents;
    vector<string> filesName;

    // Remove trailing slash if present
    if (this->filePath[this->filePath.length() - 1] == '/')
    {
        this->filePath = this->filePath.substr(0, this->filePath.length() - 1);
    }

    // Get the directory path on the server
    dirPath = get_working_path() + this->filePath.substr(1);

    // Open directory
    dh = opendir(dirPath.c_str());
    if (!dh)
    {
        cerr << "The given directory is not found";
        return;
    }

    // Read directory contents
    while ((contents = readdir(dh)) != NULL)
    {
        string name = contents->d_name;
        filesName.push_back(name);
    }
    closedir(dh);

    // Set HTML Header
    this->content = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><title>Webserv</title><meta name=\"description\" content=\"\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body>";

    // Set links towards files and directories
    for (unsigned long i = 0; i < filesName.size(); i++)
    {
        this->content += "<a href=\"";
        if (this->filePath != "/")
        {
            if (this->filePath[0] == '.')
                this->content += this->filePath.substr(1);
            else
                this->content += this->filePath;
        }
        this->content += '/' + filesName[i];
        this->content += "\">" + filesName[i] + "</a><br>";
    }

    this->content += "</body></html>";
}

void Response::setContentType()
{
    size_t lastPointPosition;
    string fileExtension;

    // Find the file extension
    lastPointPosition = this->filePath.find_last_of('.');
    if (lastPointPosition == 0)
        fileExtension = "html";
    else
        fileExtension = this->filePath.substr(lastPointPosition + 1);

    // Determine the file format
    if (fileExtension == "png" ||
        fileExtension == "jpeg" ||
        fileExtension == "jpg" ||
        fileExtension == "ico" ||
        fileExtension == "webp")
        this->contentType = "image/" + fileExtension;
    else if (fileExtension == "ttf")
        this->contentType = "font/" + fileExtension;
    else if (fileExtension == "js")
        this->contentType = "text/javascript";
    else
        this->contentType = "text/" + fileExtension;
}

void Response::setContentLength()
{
    stringstream sstm;

    sstm << this->content.size();
    this->contentLength = sstm.str();
}

void Response::send()
{
    string message;

    message += "HTTP/1.1 " + this->statusCode + "\r\n";
    message += "Accept: " + this->contentType + ", */*" + "\r\n";
    message += "Content-Type: " + this->contentType + "\r\n";
    message += "Content-Length: " + this->contentLength + "\r\n";
    message += std::string("Connection: Keep-Alive") + "\r\n";
    message += std::string("Server: ") + config.getName() + "\r\n";

    message += "\r\n";
    message += this->content;
    message += "\r\n";

    SendMessage(message, sock);
}

void Response::SendFile(const char *filePath)
{
    (void)filePath;
}
