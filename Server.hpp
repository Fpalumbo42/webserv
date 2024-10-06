/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Server.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/28 15:17:28 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/02 19:04:10 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SERVER_HPP
#define SERVER_HPP

#include "webserv.h"
#include "Request.hpp"
#include "Parsconfig.hpp"

class Server
{
private:
    std::vector<Parsconfig *> configFile;

public:
    Server();
    ~Server();

    void SetParsconfig(Parsconfig *pars);
    int GetParsconfigIndexFromHostPort(string request);
    string GetHostPort(string request);
    string GetHost(string request);
    string GetPort(string request);
    std::string readRequest(SOCKET clientSock);
    void FreeAllConfig();

    int CreateSocket(int port, bool isListening, struct sockaddr_in addr);

    void Init();
    void CloseSockets();
};

#endif