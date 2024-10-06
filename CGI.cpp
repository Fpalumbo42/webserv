/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CGI.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/04 15:43:59 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/26 14:08:51 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "CGI.hpp"

static void ft_alarm(int sig)
{
    cerr << sig << endl;
}

void CGI::launchCgi(string filePath, SOCKET sock, Parsconfig config)
{
    int tube[2];
    pid_t pid;

    if (pipe(tube) == -1)
        Response response(CODE_STATUS_500, config.getError500(), sock, config);

    pid = fork();
    switch (pid)
    {
    case -1: {
        close(tube[0]);
        close(tube[1]);
        Response response(CODE_STATUS_500, config.getError500(), sock, config); }
        return;

    case 0:
    {
        close(tube[0]);
        dup2(tube[1], STDOUT_FILENO);

        char *env[] = {
            const_cast<char *>("QUERY_STRING=name=jfazi"),
            const_cast<char *>("SERVER_PROTOCOL=HTTP/1.1"),
            const_cast<char *>("SERVER_SOFTWARE=webserv/1.0"),
            const_cast<char *>("CONTENT_LENGTH=-1"),
            const_cast<char *>("GATEWAY_INTERFACE=CGI/1.1"),
            NULL};
        char *const *nll = NULL;
        signal(SIGALRM, ft_alarm);
        alarm(5);
        execle(filePath.c_str(), filePath.c_str(), nll, env);
        close(tube[1]);
        _exit(EXIT_FAILURE);
    }
    break;

    default:
        close(tube[1]);

        char buffer[1000];
        ssize_t bytesRead = read(tube[0], buffer, sizeof(buffer));
        close(tube[0]);

        if (bytesRead == -1)
            Response response(CODE_STATUS_500, config.getError500(), sock, config);

        int status;
        waitpid(pid, &status, 0);

        if (WIFEXITED(status) && WEXITSTATUS(status) != 0)
            Response response(CODE_STATUS_500, config.getError500(), sock, config);
        else
            Response response(CODE_STATUS_200, sock, config, string(buffer, bytesRead));
        break;
    }
}

CGI::CGI() {}
CGI::~CGI() {}