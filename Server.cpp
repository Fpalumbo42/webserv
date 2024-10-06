/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Server.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jfazi <jfazi@student.42nice.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/06 08:45:27 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/09/27 14:03:30 by jfazi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Server.hpp"
#include <signal.h>

std::vector<SOCKET> listen_socks;
Parsconfig *configFileAllocated = NULL;
std::vector<int> ports;

Server::Server() {}
Server::~Server() {}

std::string Server::readRequest(SOCKET clientSock)
{
    std::string request;
    char buffer[4096];
    ssize_t bytesRead;

    // Read the request in chunks until all headers are received
    bytesRead = recv(clientSock, buffer, sizeof(buffer), 0);
    if (bytesRead <= 0)
    {
        close(clientSock);
        return "";
    }
    
    request.append(buffer, bytesRead);


    return request;
}

// Function to free allocated resources
void freeResources()
{
    // Close all open sockets
    for (std::vector<SOCKET>::iterator it = listen_socks.begin(); it != listen_socks.end(); ++it)
    {
        close(*it);
    }

    // Free the memory of the configuration file
    if (configFileAllocated)
    {
        delete configFileAllocated;
        configFileAllocated = NULL;
    }

    ports.clear();

    std::cout << GREEN <<  "Resources freed and sockets closed." << RESET << std::endl;
}

void Server::SetParsconfig(Parsconfig *pars)
{
    this->configFile.push_back(pars);
}

// Return a socket fd
SOCKET Server::CreateSocket(int port, bool isListening, struct sockaddr_in addr)
{
    SOCKET sock;
    int opt = 1;

    // Socket creation
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET)
    {
        exit(EXIT_FAILURE);
    }

    // Set socket options
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)))
    {
        close(sock);
        exit(EXIT_FAILURE);
    }

    // Initialize address
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(port);
    bzero(&(addr.sin_zero), 8);

    // Bind socket
    if (bind(sock, (SOCKADDR *)&addr, sizeof(addr)) < 0)
    {
        close(sock);
        exit(EXIT_FAILURE);
    }

    // Listening socket
    if (isListening)
    {
        if (listen(sock, MAX_EVENTS) == -1)
        {
            close(sock);
            exit(EXIT_FAILURE);
        }
    }

    return sock;
}

void Server::Init()
{
    struct epoll_event ev, events[MAX_EVENTS];
    EPOLL epoll;
    SOCKET listen_sock;
    struct sockaddr_in addr;
    int nb_sockets;

    // Register the signal handler to intercept Ctrl+C (SIGINT)
    signal(SIGINT, signalHandler);

    // Creation of epoll
    epoll = epoll_create1(0); // `epoll_create1(0)` is safer
    if (epoll == -1)
    {
        exit(EXIT_FAILURE);
    }

    // Create and add listening sockets for each port in configFile
    for (unsigned long i = 0; i < this->configFile.size(); i++)
    {
        for (unsigned long j = 0; j < this->configFile[i]->getPorts().size(); j++)
        {
            ports.push_back(this->configFile[i]->getPorts()[j]);
        }
    }

    for (std::vector<int>::iterator it = ports.begin(); it != ports.end(); ++it)
    {
        int port = *it;
        listen_sock = CreateSocket(port, true, addr);
        listen_socks.push_back(listen_sock);

        // Initialize epoll_event
        ev.events = EPOLLIN;
        ev.data.fd = listen_sock;

        // Add sock to epoll
        if (epoll_ctl(epoll, EPOLL_CTL_ADD, listen_sock, &ev) == -1)
        {
            close(listen_sock);
            exit(EXIT_FAILURE);
        }
    }

    // Main Loop
    while (true)
    {
        // Wait for client action
        nb_sockets = epoll_wait(epoll, events, MAX_EVENTS, -1);
        if (nb_sockets == -1)
        {
            freeResources();
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < nb_sockets; i++)
        {
            bool is_listen_socket = false;
            for (std::vector<SOCKET>::iterator it = listen_socks.begin(); it != listen_socks.end(); ++it)
            {
                SOCKET sock = *it;
                if (events[i].data.fd == sock)
                {
                    // New incoming connection
                    socklen_t size_addr = sizeof(addr);
                    SOCKET conn_sock = accept(sock, (struct sockaddr *)&addr, &size_addr);
                    if (conn_sock == -1)
                    {
                        continue;
                    }
                    // setnonblocking(conn_sock);
                    ev.events = EPOLLIN | EPOLLET;
                    ev.data.fd = conn_sock;
                    if (epoll_ctl(epoll, EPOLL_CTL_ADD, conn_sock, &ev) == -1)
                    {
                        close(conn_sock);
                        continue;
                    }
                    is_listen_socket = true;
                    break;
                }
            }

            if (!is_listen_socket)
            {
                // Handle communications on an existing connection socket
                std::string request = readRequest(events[i].data.fd);

                if (request.empty())
                {
                    close(events[i].data.fd);
                    continue;
                }

                std::cout << CYAN << request << RESET << std::endl;

                if (GetParsconfigIndexFromHostPort(request) == -1)
                    Response response(CODE_STATUS_400, this->configFile[0]->getError400(), events[i].data.fd, *this->configFile[0]);
                else 
                    Request req(request, events[i].data.fd, *configFile[GetParsconfigIndexFromHostPort(request)]);

                close(events[i].data.fd);
            }
        }
    }
}

string Server::GetHostPort(string request)
{
    string hostPort;

    size_t found = request.find("Host: ");
    if (found == string::npos)
        return "";

    found += 6;
    size_t end = request.find_first_of("\n", found);
    if (end == string::npos)
        return "";

    hostPort = request.substr(found, end - found - 1);
    return hostPort;
}

string Server::GetHost(string request)
{
    string host;
    string hostPort;

    hostPort = GetHostPort(request);
    if (hostPort == "")
        return "";

    size_t end = hostPort.find_first_of(":", 0);
    if (end == string::npos)
        return "";

    host = hostPort.substr(0, end);
    return host;
}

string Server::GetPort(string request)
{
    string port;
    string hostPort;

    hostPort = GetHostPort(request);
    if (hostPort == "")
        return "";

    size_t found = hostPort.find_first_of(":", 0);
    if (found == string::npos)
        return "";

    port = hostPort.substr(found + 1);
    return port;
}

int Server::GetParsconfigIndexFromHostPort(string request)
{
    string host = GetHost(request);
    string port = GetPort(request);

    bool hasFounded = false;
    for (unsigned long i = 0; i < this->configFile.size(); i++)
    {
        if (this->configFile[i]->getHost() == host)
            hasFounded = true;
    }
    if (!hasFounded)
        return -1;

    for (unsigned long i = 0; i < this->configFile.size(); i++)
    {
        for (int j = 0; j < this->configFile[i]->getPortsCount(); j++)
        {
            if (this->configFile[i]->getPorts()[j] == atoi(port.c_str())
            && this->configFile[i]->getHost() == host)
                return i;
        }
    }

    return -1;
}

void Server::CloseSockets()
{
    // Close each listening socket in the listen_socks vector
    for (std::vector<SOCKET>::iterator it = listen_socks.begin(); it != listen_socks.end(); ++it)
    {
        if (*it != -1)
        {
            close(*it);
            std::cout << GREEN << "Socket " << *it << " closed." << RESET << std::endl;
        }
    }

    listen_socks.clear();

    std::cout << GREEN << "All listening sockets have been closed." << RESET << std::endl;
}

void Server::FreeAllConfig()
{
    std::vector<Parsconfig *>::iterator it = configFile.begin();

    while (it != configFile.end())
    {
        if (*it != NULL)
        {
            (*it)->freeAllocatedResources();
            delete *it;
            *it = NULL;
        }
        it++;
    }

    configFile.clear();

    std::cout << GREEN << "All configuration files have been deleted." << RESET << std::endl;
}
