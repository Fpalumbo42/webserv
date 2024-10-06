/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/23 12:48:45 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/02 19:05:11 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "webserv.h"
#include "Server.hpp"
#include "Parsconfig.hpp"

Server *global_server = NULL;
std::vector<std::string> parsconfigs;

bool hasConfExtension(const std::string &filename)
{
    size_t pos = filename.rfind(".");
    if (pos != std::string::npos)
    {
        std::string extension = filename.substr(pos);
        if (extension == ".conf")
            return true;
    }
    return false;
}

void signalHandler(int signum)
{
    std::cout << std::endl << GREEN << "Interrupt signal (" << signum << ") received." << RESET << std::endl;

    if (global_server != NULL)
    {
        global_server->CloseSockets();
        global_server->FreeAllConfig();
        parsconfigs.clear();
        delete global_server;
        global_server = NULL;
    }

    std::cout << GREEN << "Server deleted and resources freed." << RESET << std::endl;

    exit(signum);
}

std::vector<std::string> cutParsconfig(std::string file_name)
{
    std::string str_file;
    std::ifstream file(file_name.c_str());
    std::string line;
    std::vector<std::string> serv;

    if (!file.is_open())
        throw(Parsconfig::Badfile());

    while (getline(file, line))
    {
        str_file += line;
        if (!file.eof())
            str_file += '\n';
        if (!line.compare("};"))
        {
            serv.push_back(str_file);
            str_file.clear();
        }
    }
    file.close();
    return (serv);
}

int main(int argc, char **argv)
{
    signal(SIGINT, signalHandler);

    try
    {
        if (argc <= 2)
        {
            if (argc == 1)
                parsconfigs = cutParsconfig("config/default.conf");
            else
            {
                if (!hasConfExtension(argv[1]))
                {
                    std::cout << RED << ".conf expected" << RESET << std::endl;
                    return 1;
                }
                parsconfigs = cutParsconfig(argv[1]);
            }
            if (!parsconfigs.empty())
            {
                global_server = new Server();

                for (size_t i = 0; i < parsconfigs.size(); i++)
                {
                    global_server->SetParsconfig(new Parsconfig(parsconfigs[i]));
                }

                global_server->Init();
                global_server->CloseSockets();

                delete global_server;
                global_server = NULL;
            }
            else
            {
                std::cout << RED << "No valid server configurations found." << RESET << std::endl;
            }
        }
        else
        {
            std::cout << RED << "Usage : ./webserv serv.conf" << RESET << std::endl;
        }
    }
    catch (std::exception &e)
    {
        std::cout << e.what() << std::endl;
    }

    return 0;
}