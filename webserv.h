/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   webserv.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/23 12:47:53 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/05 15:38:56 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef WEBSERV_H
#define WEBSERV_H

// --- I N C L U D E S --- //
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <arpa/inet.h>
#include <stdlib.h>
#include <iostream>
#include <unistd.h>
#include <stdio.h>
#include <errno.h>
#include <map>
#include <string.h>
#include <limits.h>
#include <sys/epoll.h>
#include <netdb.h>
#include <fstream>
#include <vector>
#include <fcntl.h>
#include <sstream>
#include <stdlib.h>
#include <math.h>
#include <sys/wait.h>
#include <dirent.h>
#include <sys/stat.h>

#define RESET "\033[0m"
#define BLACK "\033[30m"
#define RED "\033[31m"
#define GREEN "\033[32m"
#define YELLOW "\033[33m"
#define BLUE "\033[34m"
#define MAGENTA "\033[35m"
#define CYAN "\033[36m"
#define WHITE "\033[37m"

// --- D E F I N E S --- //
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#define INADDER_ANY 0
#define MAX_EVENTS 100

#define CODE_STATUS_200 "200 OK"
#define CODE_STATUS_201 "201 Created"
#define CODE_STATUS_400 "400 Bad Request"
#define CODE_STATUS_404 "404 Not Found"
#define CODE_STATUS_405 "405 Method Not Allowed"
#define CODE_STATUS_413 "413 Request Entity Too Large"
#define CODE_STATUS_500 "500 Internal Server Error"
#define CODE_STATUS_505 "505 HTTP Version Not Supported"

typedef int SOCKET;
typedef int EPOLL;
typedef struct sockaddr_in SOCKADDR_IN;
typedef struct sockaddr SOCKADDR;
typedef struct in_addr IN_ADDR;

using namespace std;

typedef enum
{
    GET,
    POST,
    DELETE
} E_Method;

void SendMessage(string msg, SOCKET sock);
int isDirectory(const char *path);
string get_working_path();
void freeResources();
void signalHandler(int signum);

#endif