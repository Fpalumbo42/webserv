/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jfazi <jfazi@student.42nice.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/03 11:16:49 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/27 13:59:00 by jfazi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "webserv.h"

string get_working_path()
{
    char temp[1000];
    return (getcwd(temp, sizeof(temp)) ? std::string(temp) : std::string(""));
}

int isDirectory(const char *path)
{
    struct stat statbuf;
    if (stat(path, &statbuf) != 0)
        return 0;
    return S_ISDIR(statbuf.st_mode);
}

// Used to send a string throught a socket in direction to the client
void SendMessage(string msg, SOCKET sock)
{
    int bytesSentCurrent = 0;
    int msgLen = msg.size();

    bytesSentCurrent = send(sock, &msg[0], msgLen, 0);
    if (bytesSentCurrent <= 0)
    {
        close(sock);
    }
}
