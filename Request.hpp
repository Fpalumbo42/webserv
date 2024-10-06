/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Request.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jfazi <jfazi@student.42nice.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/18 16:27:52 by jfazi             #+#    #+#             */
/*   Updated: 2024/09/07 16:22:49 by jfazi            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once
#include "webserv.h"
#include "Response.hpp"
#include "Parsconfig.hpp"
#include "CGI.hpp"
#include <vector>
#include <string>

class Request
{
private:
    std::string httpVersion;
    E_Method method;
    std::string filePath;
    std::string host;
    std::string connection;
    std::string accept;
    std::string acceptEncoding;
    std::string acceptLanguages;

    Parsconfig config;
    std::string request;
    SOCKET sock;

public:
    Request(const std::string &request, SOCKET sock, const Parsconfig &serv);
    ~Request();

    void setMethod(const Parsconfig &serv);
    void setFilePath();
    void setHTTPVersion();
    bool CheckMethod(const Parsconfig &serv, const std::string &method);
    bool CheckMethodSpe(const Parsconfig &serv, const std::string &method);
    std::string getPath() const;
    void deleteFile();
    void uploadFile();
    void post();


    class BadMethodException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
    class BadFilePathException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
    class BadHTTPVersionException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
    class BadSintaxException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
    class RequestEntityTooLargeException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
    class DefaultFileException : public std::exception
    {
    public:
        virtual const char *what() const throw();
    };
};
