# Webserv - HTTP Server in C++ 🌐

## 📘 Project Overview

Webserv is a custom-built HTTP server project developed in C++ as part of the curriculum at 42. The goal is to create a fully functional web server that can handle HTTP requests and responses, manage multiple clients concurrently, and serve static files. It supports features such as request parsing, file uploads, and multipart form data handling.

## 🛠️ Features

- Serve static files and directories.
- Handle HTTP requests (GET, POST, DELETE).
- Manage multiple clients concurrently.
- Support for multipart/form-data for file uploads.
- Configurable server settings with a fully functional config file.
- C++98 compliant implementation.
- CGI support.
- A bonus game included on the website.

## ⚙️ Installation

1. Clone the repository:

`git clone git@github.com:Fpalumbo42/webserv.git`

3. Build the project:

`make`

4. Run the server:

`./webserv [configuration file]`

5. Access the server in your browser:

`http://localhost:[port indicated in config file]`

## 🖥️ Technologies Used

- C++98: Server written in C++98 for portability.
- epoll(): Multiplexing for handling multiple client connections.
- HTTP/1.1: Protocol support for client-server communication.
- JavaScript: Used for the game.
- PHP: Used for CGI.

## 🔧 Configuration

The server can be customized using a configuration file that specifies server settings such as:

- Listening ports
- Root directories
- Supported methods (GET, POST, DELETE)
- Error pages
- File upload handling
- Path for CGI
- Client body size
- Autoindex
- Page redirection
- Method for a certain root



   


  
