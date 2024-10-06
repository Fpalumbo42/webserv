/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Request.cpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/18 17:15:08 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/26 14:10:53 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Request.hpp"
#include "Parsconfig.hpp"

bool Request::CheckMethod(const Parsconfig &serv, const std::string &method)
{
    std::string *tmp = serv.getMethods();
    int numMethods = serv.getMethodsCount();
    for (int i = 0; i < numMethods; i++)
    {
        if (tmp[i] == method)
            return true;
    }
    return false;
}
bool Request::CheckMethodSpe(const Parsconfig &serv, const std::string &method)
{
    std::string *tmp = serv.getMethodsSpe();
    int numMethods = serv.getMethodsCountSpe();
    for (int i = 0; i < numMethods; i++)
    {
        if (tmp[i] == method)
            return true;
    }
    return false;
}

int stringToInt(const std::string& str) {
    std::stringstream ss(str);
    int num;
    ss >> num;
    return num;
}

std::string parseHeaders(const std::string &request)
{
    std::istringstream stream(request);
    std::string line;
    std::string headers;

    // Skip the request line (first line)
    std::getline(stream, line);

    // Parse the headers
    while (std::getline(stream, line) && line != "\r")
    {
        headers += line + "\n";
    }

    return headers;
}


Request::Request(const std::string& request, SOCKET sock, const Parsconfig& serv)
    : config(serv), request(request), sock(sock)
{

    try
    {
        setMethod(serv);
        std::string headers = parseHeaders(this->request);
        if (method == POST)
        {
            // for file upload
            if (headers.find("multipart/form-data") != string::npos) {
                uploadFile();
                return;
            }
            else
            {
                setFilePath();
                setHTTPVersion();
                post();
                return;
            }
        }
        else if (method == GET)
        {
            setFilePath();
            setHTTPVersion();
        }
        else if (method == DELETE) {
            setFilePath();
            setHTTPVersion();
        
            deleteFile();
        }

        Response response(CODE_STATUS_200, this->filePath, sock, serv);
    }
    catch (const BadMethodException &e)
    {
        Response response(CODE_STATUS_405, serv.getError405(), sock, serv);
    }
    catch (const BadFilePathException &e)
    {
        Response response(CODE_STATUS_404, serv.getError404(), sock, serv);
    }
    catch (const BadHTTPVersionException &e)
    {
        Response response(CODE_STATUS_505, serv.getError505(), sock, serv);
    }
    catch (const RequestEntityTooLargeException &e)
    {
        Response response(CODE_STATUS_413, serv.getError413(), sock, serv);
    }
    catch (const BadSintaxException &e)
    {
        Response response(CODE_STATUS_400, serv.getError400(), sock, serv);
    }
    catch (const DefaultFileException &e)
    {
        Response response(CODE_STATUS_200, "./index.html", sock, serv);
    }
}
Request::~Request() {}

void Request::deleteFile()
{
    // Check if file exists
    ifstream fileExist;
    fileExist.open((this->filePath).c_str());
    if (!fileExist)
        throw BadFilePathException();
    fileExist.close();

    remove((this->filePath).c_str());
}

void Request::post()
{
    string filename, boundary, body;
    int begin;

    // Get body
    begin = this->request.find("\r\n\r\n") + 4;
    body = this->request.substr(begin);

    if (body.length() >= this->config.getMaxBodySize())
        throw RequestEntityTooLargeException();

    // Check if file exists
    ifstream fileExist;
    fileExist.open((this->filePath + "/" + "post_data").c_str());
    if (fileExist)
        remove((this->filePath + "/" + "post_data").c_str());
    fileExist.close();

    // Create file
    std::ofstream outFile((this->filePath + "/" + "post_data").c_str(), std::ios::app);
    if (outFile.is_open())
    {
        outFile << body << std::endl;
        outFile.close();
    }

    Response response(CODE_STATUS_201, "./html/file_uploaded.html", this->sock, this->config);
}

void Request::uploadFile()
{
    string filename, boundary, body;
    int begin, end;
    // Get directory
    setFilePath();

    // Get filename
    begin = this->request.find("filename=\"") + 10;
    end = this->request.substr(begin).find_first_of('"');
    filename = this->request.substr(begin, end);

    // Get boundary
    begin = this->request.find("boundary=") + 9;
    end = this->request.substr(begin).find_first_of('\n');
    boundary = this->request.substr(begin, end);

    // Get body
    begin = this->request.find("Content-Type:", begin) + 14;
    begin = this->request.find("\r\n\r\n", begin) + 4;
    end = this->request.substr(begin).find_last_of("\r\n\r\n") - boundary.length() - 6;
    body = this->request.substr(begin, end);

    if (body.length() >= this->config.getMaxBodySize())
        throw RequestEntityTooLargeException();

    // Check if file exists
    ifstream fileExist;
    fileExist.open((this->filePath + "/" + filename).c_str());
    if (fileExist)
        remove((this->filePath + "/" + filename).c_str());
    fileExist.close();

    // Create file
    std::ofstream outFile((this->filePath + "/" + filename).c_str(), std::ios::app);
    if (outFile.is_open())
    {
        outFile << body << std::endl;
        outFile.close();
    }

    Response response(CODE_STATUS_201, "./html/file_uploaded.html", this->sock, this->config);
}



void Request::setMethod(const Parsconfig &serv)
{
    // Find the end of the HTTP method
    size_t methodEndPosition = this->request.find(' ');
    if (methodEndPosition == std::string::npos)
        throw BadSintaxException();

    // Extract the path without affecting `this->filePath`
    size_t pathStartPosition = methodEndPosition + 1;
    size_t pathEndPosition = this->request.find(' ', pathStartPosition);

    if (pathEndPosition == std::string::npos)
        throw BadSintaxException();

    std::string path = "." + this->request.substr(pathStartPosition, pathEndPosition - pathStartPosition);

    int methodLength = -1;

    // Specific methods for the "/upload" path

    std::string uploadPath = serv.getDataPath("upload") + "/";

    if (path.find(uploadPath) == 0)
    {
        if (this->request.find("POST") == 0 && CheckMethodSpe(serv, "POST"))
        {
            this->method = POST;
            methodLength = 4;
        }
        else if (this->request.find("GET") == 0 && CheckMethodSpe(serv, "POST"))
        {
            this->method = GET;
            methodLength = 3;
        }
        else if (this->request.find("DELETE") == 0 && CheckMethodSpe(serv, "DELETE"))
        {
            this->method = DELETE;
            methodLength = 6;
        }
        else
        {
            throw BadMethodException();
        }
    }
    else
    {

        if (this->request.find("GET") == 0 && CheckMethod(serv, "GET"))
        {
            this->method = GET;
            methodLength = 3;
        }
        else if (this->request.find("POST") == 0 && CheckMethod(serv, "POST"))
        {
            this->method = POST;
            methodLength = 4;
        }
        else if (this->request.find("DELETE") == 0 && CheckMethod(serv, "DELETE"))
        {
            this->method = DELETE;
            methodLength = 6;
        }
        else
        {
            throw BadMethodException();
        }
    }

    // Trim the request to remove the method and path
    this->request = this->request.substr(methodLength + 1);
}



void Request::setFilePath()
{
    size_t endPathPosition = -1;

    // Find the end of the path
    if ((endPathPosition = this->request.find(' ')) == string::npos)
        throw BadSintaxException();
    this->filePath = '.' + request.substr(0, endPathPosition);

    // If path is cgi
    if (this->filePath.find("cgi-get") != std::string::npos) {
        CGI *cgi = new CGI();
        cgi->launchCgi(this->config.getCgiPath("script1"), sock, this->config);
        return;
    }
    if (this->filePath.find("cgi-post") != std::string::npos) {
        CGI *cgi = new CGI();
        cgi->launchCgi(this->config.getCgiPath("script2"), sock, this->config);
        return;
    }

    // Check if the file exists
    int tmp = open(this->filePath.c_str(), O_RDONLY);
    if (tmp == -1)
        throw BadFilePathException();
    close(tmp);


    if (this->filePath == "/" || this->filePath == "" || this->filePath == "./")
        this->filePath = "index.html";

    // Just a directory, but the autoindex isn't available with the configfile
    if (!this->config.getAutoIndex() && isDirectory(this->filePath.c_str()) && this->filePath[this->filePath.length() - 1] == '/') {
        throw BadSintaxException();
    }

    // Remove the path from the request to simplify further parsing
    this->request = this->request.substr(endPathPosition + 1);
}

void Request::setHTTPVersion()
{
    size_t endHTTPVersionPosition = -1;

    // Find the end of the HTTP version
    if ((endHTTPVersionPosition = this->request.find('\n')) == string::npos)
        throw BadSintaxException();
    this->httpVersion = this->request.substr(0, endHTTPVersionPosition - 1);

    // Check if it is the correct HTTP version (1.1)
    if (this->httpVersion != "HTTP/1.1")
        throw BadHTTPVersionException();

    // Remove the HTTP version from the request to simplify further parsing
    this->request = this->request.substr(endHTTPVersionPosition + 1);
}

std::string Request::getPath() const {
    return this->filePath;
}

/////////////////////////
/// E X C E P T I O N ///
/////////////////////////
const char *Request::BadMethodException::what() const throw() { return ("Request: Bad Method"); }
const char *Request::BadFilePathException::what() const throw() { return ("Request: Bad File Path"); }
const char *Request::BadHTTPVersionException::what() const throw() { return ("Request: Bad HTTP Version"); }
const char *Request::BadSintaxException::what() const throw() { return ("Request: Bad Request Syntax"); }
const char *Request::RequestEntityTooLargeException::what() const throw() { return ("Request: Request Entity Too Large"); }
const char *Request::DefaultFileException::what() const throw() { return (""); }
